import { Form, Modal, Upload } from 'antd';
import React from 'react';

import { InboxOutlined } from '@ant-design/icons';
import { isCheckLoading } from '@helper/isCheckLoading';
import productPresenter from '@modules/product/presenter';
import ButtonForm from '@shared/components/ButtonForm';
import { useSingleAsync } from '@shared/hook/useAsync';

interface IProps {
  isModalVisible: boolean;
  story: string;
  setIsModalVisible: (arg: any) => void;
  setStory: (arg: any) => void;
}

const ModalAddImage = (props: IProps) => {
  const { isModalVisible, setIsModalVisible, setStory, story } = props;
  const [form] = Form.useForm();
  const addLinkImgProductCall = useSingleAsync(productPresenter.addLinkImgProduct);

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (value: any) => {
    value.File = value.File.file;
    addLinkImgProductCall?.execute(value).then((res: any) => {
      setStory(`${story} <img src="${res}" width="500" height="auto"/>`);
      setIsModalVisible(false);
    });
  };

  return (
    <Modal
      closable={false}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="modal-upload-image"
      footer={
        <ButtonForm
          formName="form-modal"
          nameButtonSubmit={'common.add'}
          onCancelForm={() => handleCancel()}
          isLoading={isCheckLoading([addLinkImgProductCall])}
        />
      }
    >
      <Form
        form={form}
        className="main-form"
        layout="vertical"
        name="form-modal"
        onFinish={handleSubmit}
      >
        <Form.Item name="File">
          <Upload.Dragger beforeUpload={() => false} maxCount={1}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single. Strictly prohibit from uploading company data or other band
              files
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(ModalAddImage);
