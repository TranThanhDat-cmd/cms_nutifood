import { Button, Form, Input, Modal, Space, Upload } from 'antd';
import React from 'react';

import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { isCheckLoading } from '@helper/isCheckLoading';
import bannerPresenter from '@modules/banner/presenter';
import ButtonForm from '@shared/components/ButtonForm';
import { useSingleAsync } from '@shared/hook/useAsync';
import { useAltaIntl } from '@shared/hook/useTranslate';

import { IPropsModalAdd } from '../../interface';

const ModalAddMedia = (props: IPropsModalAdd) => {
  const { modalAdd, setModalAdd, handleRefresh } = props;
  const [form] = Form.useForm();
  const { formatMessage } = useAltaIntl();
  const createMediaInBanner = useSingleAsync(bannerPresenter.createMediaInBanner);

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setModalAdd({ isVisible: false, dataEdit: null });
    form.resetFields();
    handleRefresh();
  };

  const onFinish = (value: any) => {
    value.bannerMedias = value.bannerMedias.map(banner => {
      const newBanner = {
        name: banner.name,
        file: banner.file.file,
      };
      return newBanner;
    });

    createMediaInBanner.execute(modalAdd.dataEdit.id, value).then(() => handleCancel());
  };

  const translateFirstKey = 'banner'; //put your translate here

  return (
    <Modal
      className="main-modal"
      title={formatMessage(`${translateFirstKey}.create-media`) + ' ' + modalAdd?.dataEdit?.name}
      visible={modalAdd.isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <ButtonForm
          isDisabled={modalAdd.isReadOnly ? true : false}
          formName="form-banner"
          nameButtonSubmit={'common.add'}
          onCancelForm={() => handleCancel()}
          onOk={() => handleOk()}
          isLoading={isCheckLoading([createMediaInBanner])}
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
        <div className="title_upload my-2">{formatMessage('banner.title.bannerMedias')}</div>
        <Form.List name="bannerMedias">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <Space key={key} align="start" className="mb-3">
                    <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                      <Input
                        placeholder={formatMessage('banner.placeholder.bannerMedias')}
                        autoComplete="off"
                      />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'file']} rules={[{ required: true }]}>
                      <Upload
                        beforeUpload={() => false}
                        disabled={modalAdd.isReadOnly}
                        maxCount={1}
                        showUploadList={{ showRemoveIcon: false }}
                        listType="picture"
                      >
                        <Button className="btn">
                          <UploadOutlined />
                        </Button>
                      </Upload>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                );
              })}
              {fields.length < 3 && (
                <Button type="dashed" onClick={() => add()} block>
                  <PlusOutlined />
                  {formatMessage('banner.add.media')}
                </Button>
              )}
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ModalAddMedia;
