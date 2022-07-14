import { Button, Form, Input, Modal, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { FormContent, IFormContent } from '@hoc/FormHelper';
import authenticationPresenter from '@modules/authentication/presenter';
import RoleEntity from '@modules/roles/entity';
import rolePresenter from '@modules/roles/presenter';
import userPresenter from '@modules/user/presenter';
import ButtonForm from '@shared/components/ButtonForm';
import { ISelectData } from '@shared/components/SelectAndLabelConponent';
import { useSingleAsync } from '@shared/hook/useAsync';
import { useAltaIntl } from '@shared/hook/useTranslate';

import { IPropsModal } from '../../interface';

const ModalUser = (props: IPropsModal) => {
  const { modal, setModal, handleRefresh } = props;
  const [form] = Form.useForm();
  const { formatMessage, intl } = useAltaIntl();
  const [typeModal, setTypeModal] = useState<'EDIT' | 'ADD'>('ADD');
  const [roles, setRoles] = useState<RoleEntity[]>();
  const { Option } = Select;
  const updateUser = useSingleAsync(userPresenter.updateUser);
  const addUser = useSingleAsync(userPresenter.addUser);

  // JUST FORM
  useEffect(() => {
    rolePresenter.getListRole({}).then(res => {
      setRoles(res.data);
    });
  }, []);

  const formContent: IFormContent[] = React.useMemo<IFormContent[]>(() => {
    return [
      {
        name: 'userName',
        label: 'login.userName',
        readOnly: modal.isReadOnly,
        hidden: modal.dataEdit ? true : false,
      },
      {
        name: 'fullName',
        label: 'user.fullName',
        readOnly: modal.isReadOnly,
      },
      {
        name: 'emailAddress',
        label: 'user.emailAddress',
        readOnly: modal.isReadOnly,
      },
      {
        name: 'password',
        label: 'auth.password',
        hidden: modal.isReadOnly,
        rules: [
          {
            pattern: /^(?=.*\d)(?=.*[a-z]).{8,}$/,
            message: formatMessage('profile.invalid_password'),
          },
        ],
        render() {
          return <Input.Password placeholder="********" autoComplete="off" />;
        },
      },
      {
        name: 'confirmPassword',
        label: 'auth.password.confirm',
        hidden: modal.isReadOnly,
        rules: [
          {
            pattern: /^(?=.*\d)(?=.*[a-z]).{8,}$/,
            message: formatMessage('profile.invalid_password'),
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(formatMessage('require.password_notMatch')));
            },
          }),
        ],
        render() {
          return <Input.Password placeholder="********" autoComplete="off" />;
        },
      },
      {
        name: 'avatar',
        label: 'user.avatar',
        render() {
          return (
            <Upload
              beforeUpload={() => false}
              disabled={modal.isReadOnly}
              maxCount={1}
              listType="picture"
              fileList={
                modal.dataEdit && modal.isReadOnly
                  ? [
                      {
                        uid: '1',
                        status: 'done',
                        name: '',
                        url: modal.dataEdit.avatar,
                      },
                    ]
                  : undefined
              }
            >
              <Button icon={<UploadOutlined />} className={modal.isReadOnly ? 'd-none' : ''}>
                {formatMessage('user.upload')}
              </Button>
            </Upload>
          );
        },
      },
      {
        name: 'roleId',
        label: 'user.role',
        // rules: [{ pattern: /^\d+$/g }],
        readOnly: modal.isReadOnly,
        render() {
          return (
            <Select placeholder={formatMessage('user.role')} disabled={modal.isReadOnly}>
              {roles?.map(role => (
                <Option value={role.id}>{role.name}</Option>
              ))}
            </Select>
          );
        },
      },
    ];
  }, [modal.isReadOnly, roles, modal.dataEdit]);

  useEffect(() => {
    if (modal.dataEdit !== null) {
      form.setFieldsValue(modal.dataEdit);
      setTypeModal('EDIT');
    } else {
      setTypeModal('ADD');
    }
  }, [modal]);

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    setModal({ isVisible: false, dataEdit: null });
    form.resetFields();
    handleRefresh();
  };
  const onFinish = value => {
    //thêm xóa sửa value here
    const formSend = { ...value };
    formSend.avatar = formSend.avatar ? formSend.avatar.file : null;
    if (typeModal == 'EDIT') {
      updateUser.execute(formSend, modal.dataEdit.id).then(() => {
        authenticationPresenter.getProfile().then(() => {
          handleCancel();
        });
      });
    } else {
      addUser.execute(formSend).then(() => {
        handleCancel();
      });
    }
  };

  const translateFirstKey = 'user'; //put your translate here

  const dataString: ISelectData[] = [
    { name: formatMessage('customer.true'), value: true },
    { name: formatMessage('customer.false'), value: false },
  ];

  return (
    <Modal
      className="main-modal"
      title={
        typeModal == 'EDIT'
          ? modal.isReadOnly
            ? formatMessage(`${translateFirstKey}.information`)
            : formatMessage(`${translateFirstKey}.update`)
          : formatMessage(`${translateFirstKey}.create`)
      }
      visible={modal.isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <ButtonForm
          isDisabled={modal.isReadOnly ? true : false}
          formName="form-device"
          nameButtonSubmit={typeModal == 'EDIT' ? 'common.update' : 'common.add'}
          onCancelForm={() => handleCancel()}
          onOk={() => handleOk()}
        />
      }
      closable={false}
    >
      <Form
        form={form}
        className="main-form" //important
        layout="vertical" //important
        name="basic"
        onFinish={onFinish}
      >
        {formContent.map((item: IFormContent) => {
          const renderItem = new FormContent(item);
          return (
            <Form.Item
              key={item.name}
              //@ts-ignore
              label={formatMessage(item?.label)}
              name={item?.name}
              rules={item.rules}
              hidden={item.hidden}
            >
              {renderItem.render(intl)}
            </Form.Item>
          );
        })}
        {modal?.dataEdit && (
          <Form.Item label={formatMessage(`${translateFirstKey}.active`)} name="active">
            <Select disabled={modal.isReadOnly}>
              {dataString.map(item => (
                <Option value={item.value}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ModalUser;
