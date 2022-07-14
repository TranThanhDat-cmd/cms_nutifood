import { Form, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';

import { FormContent, IFormContent } from '@hoc/FormHelper';
import questionPresenter from '@modules/question/presenter';
import ButtonForm from '@shared/components/ButtonForm';
import { useAltaIntl } from '@shared/hook/useTranslate';

import { IPropsModal } from '../../interface';

const ModalQuestion = (props: IPropsModal) => {
  const { modal, setModal, handleRefresh } = props;
  const [form] = Form.useForm();
  const { formatMessage, intl } = useAltaIntl();

  const [typeModal, setTypeModal] = useState<'EDIT' | 'ADD' | 'ANSWER'>('ADD');
  // JUST FORM
  const formContent: IFormContent[] = React.useMemo<IFormContent[]>(() => {
    return [
      {
        name: 'fullName',
        label: 'question.fullName',
        rules: [{ required: true }],
        readOnly: modal.isReadOnly,
      },

      {
        name: 'email',
        label: 'question.email',
        rules: [
          { required: true },
          {
            type: 'email',
          },
        ],
        readOnly: modal.isReadOnly,
      },

      {
        name: 'phoneNumber',
        label: 'question.phoneNumber',
        rules: [{ pattern: /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/ }],
        readOnly: modal.isReadOnly,
      },

      {
        name: 'content',
        label: 'question.content',
        rules: [{ required: true }],
        readOnly: modal.isReadOnly,
      },
    ];
  }, [modal.isReadOnly]);

  useEffect(() => {
    if (modal.dataEdit !== null) {
      if (modal.isAnswer) {
        form.setFieldsValue(modal.dataEdit);
        setTypeModal('ANSWER');
        return;
      }
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
    if (typeModal == 'EDIT') {
      questionPresenter.updateQuestion(modal?.dataEdit.id, value).then(() => {
        handleCancel();
      });
    } else if (typeModal == 'ADD') {
      questionPresenter.createQuestion(value).then(() => {
        handleCancel();
      });
    } else {
      questionPresenter.answerQuestion(modal?.dataEdit.id, value).then(() => {
        handleCancel();
      });
    }
  };

  const translateFirstKey = 'question'; //put your translate here

  const showTitle = (type: string) => {
    switch (type) {
      case 'EDIT':
        return formatMessage(`${translateFirstKey}.information`);
      case 'UPDATE':
        return formatMessage(`${translateFirstKey}.update`);
      case 'ADD':
        return formatMessage(`${translateFirstKey}.create`);
      case 'ANSWER':
        return formatMessage(`${translateFirstKey}.answer`);
    }
  };

  const dataString: any[] = [
    { label: formatMessage('question.unResponsive'), value: 2 },
    { label: formatMessage('question.answered'), value: 1 },
  ];

  return (
    <Modal
      className="main-modal"
      title={showTitle(typeModal)}
      visible={modal.isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <ButtonForm
          isDisabled={modal.isReadOnly ? true : false}
          formName="form-device"
          nameButtonSubmit={
            typeModal == 'EDIT'
              ? 'common.update'
              : typeModal == 'ANSWER'
              ? 'common.answer'
              : 'common.add'
          }
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
        {!modal?.isAnswer &&
          formContent.map((item: IFormContent) => {
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
        {modal?.isAnswer && (
          <Form.Item
            label={formatMessage('question.answer')}
            name="answerStatus"
            rules={[{ required: true }]}
          >
            <Select placeholder={formatMessage('question.answer')} options={dataString} />
          </Form.Item>
        )}
        {modal.isReadOnly && (
          <Form.Item label={formatMessage('question.answer')} name="answerStatus">
            <Select
              placeholder={formatMessage('question.answer')}
              options={dataString}
              disabled={modal.isReadOnly}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ModalQuestion;
