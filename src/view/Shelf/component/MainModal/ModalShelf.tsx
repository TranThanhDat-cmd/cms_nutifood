import { Button, Form, Modal, Upload } from 'antd';
import React, { useEffect, useState } from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { FormContent, IFormContent } from '@hoc/FormHelper';
import shelfPresenter from '@modules/shelf/presenter';
import ButtonForm from '@shared/components/ButtonForm';
import { useAltaIntl } from '@shared/hook/useTranslate';

import { IPropsModal } from '../../interface';

const ModalShelf = (props: IPropsModal) => {
  const { modal, setModal, handleRefresh } = props;
  const [form] = Form.useForm();
  const { formatMessage, intl } = useAltaIntl();

  const [typeModal, setTypeModal] = useState<'EDIT' | 'ADD'>('ADD');
  // JUST FORM
  const formContent: IFormContent[] = React.useMemo<IFormContent[]>(() => {
    return [
      {
        name: 'name',
        label: 'shelf.name',
        rules: [{ required: true }, { max: 255 }],
        readOnly: modal.isReadOnly,
      },

      {
        label: 'shelf.code',
        rules: [{ required: true }, { max: 255 }],
        name: 'code',
        readOnly: modal.isReadOnly,
      },

      {
        name: 'video',
        label: 'shelf.video',
        rules: [{ required: true }],
        readOnly: modal.isReadOnly,
        render: () => {
          return (
            <Upload name="video" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />} />
            </Upload>
          );
        },
      },
    ];
  }, [modal.isReadOnly]);

  useEffect(() => {
    if (modal.dataEdit !== null) {
      // Call API Get Detail here
      form.setFieldsValue(modal?.dataEdit);
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
    const formSend = { ...value, video: value.video.file };
    if (typeModal == 'EDIT') {
      //call api
      handleCancel();
    } else {
      //call api
      shelfPresenter.createShelf(formSend).then(() => {
        handleCancel();
      });
    }
  };

  const translateFirstKey = 'shelf'; //put your translate here

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
      </Form>
    </Modal>
  );
};

export default ModalShelf;
