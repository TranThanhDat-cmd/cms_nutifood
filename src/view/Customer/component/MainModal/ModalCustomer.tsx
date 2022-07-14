import { Form, Modal, Select } from 'antd';
import React, { useEffect } from 'react';

import { isCheckLoading } from '@helper/isCheckLoading';
import { FormContent, IFormContent } from '@hoc/FormHelper';
import CustomerEntity from '@modules/customer/entity';
import customerPresenter from '@modules/customer/presenter';
import ButtonForm from '@shared/components/ButtonForm';
import { ISelectData } from '@shared/components/SelectAndLabelConponent';
import { useSingleAsync } from '@shared/hook/useAsync';
import { useAltaIntl } from '@shared/hook/useTranslate';

import { IPropsModal } from '../../interface';

const { Option } = Select;
const ModalCustomer = (props: IPropsModal) => {
  const { modal, setModal, handleRefresh } = props;
  const [form] = Form.useForm();
  const { formatMessage, intl } = useAltaIntl();
  const updateCustomer = useSingleAsync(customerPresenter.updateCustomer);

  useEffect(() => {
    if (modal.dataEdit === null) return;
    form.setFieldsValue(modal.dataEdit);
  }, [modal]);

  const dataString: ISelectData[] = [
    { name: formatMessage('common.all'), value: null },
    { name: formatMessage('customer.true'), value: true },
    { name: formatMessage('customer.false'), value: false },
  ];

  const formContent: IFormContent[] = React.useMemo<IFormContent[]>(() => {
    return [
      {
        name: 'fullName',
        label: 'customer.fullName',
        rules: [{ required: true }, { max: 255 }],
        readOnly: modal.isReadOnly,
      },

      {
        name: 'phoneNumber',
        label: 'customer.phoneNumber',
        rules: [
          { required: true },
          { pattern: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/ },
        ],
        readOnly: modal.isReadOnly,
      },
      {
        name: 'active',
        label: 'customer.active',
        rules: [{ required: true }],
        render: () => (
          <Select disabled={modal.isReadOnly}>
            {dataString.map(item => (
              <Option value={item.value}>{item.name}</Option>
            ))}
          </Select>
        ),
      },
    ];
  }, [modal.isReadOnly]);

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setModal({ isVisible: false, dataEdit: null });
    form.resetFields();
    handleRefresh();
  };

  const onFinish = (value: CustomerEntity) => {
    updateCustomer?.execute(modal.dataEdit.id, value).then(() => handleCancel());
  };

  const translateFirstKey = 'customer';

  return (
    <Modal
      className="main-modal"
      title={
        modal.isReadOnly
          ? formatMessage(`${translateFirstKey}.information`)
          : formatMessage(`${translateFirstKey}.update`)
      }
      visible={modal.isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <ButtonForm
          isDisabled={modal.isReadOnly ? true : false}
          formName="form-customer"
          nameButtonSubmit={'common.update'}
          onCancelForm={() => handleCancel()}
          onOk={() => handleOk()}
          isLoading={isCheckLoading([updateCustomer])}
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

export default ModalCustomer;
