import { Button, Form, Image, Input, Modal, Select, Upload } from 'antd';
import React, { useEffect, useState } from 'react';

import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { isCheckLoading } from '@helper/isCheckLoading';
import { FormContent, IFormContent } from '@hoc/FormHelper';
import bannerPresenter from '@modules/banner/presenter';
import ButtonForm from '@shared/components/ButtonForm';
import { DeleteConfirm } from '@shared/components/ConfirmDelete';
import { useSingleAsync } from '@shared/hook/useAsync';
import { useAltaIntl } from '@shared/hook/useTranslate';

import { IPropsModal } from '../../interface';

const ModalBanner = (props: IPropsModal) => {
  const { modal, setModal, handleRefresh } = props;
  const [form] = Form.useForm();
  const { formatMessage, intl } = useAltaIntl();
  const createBanner = useSingleAsync(bannerPresenter.createBanner);
  const updateBanner = useSingleAsync(bannerPresenter.updateBanner);
  const deleteMediaInBanner = useSingleAsync(bannerPresenter.deleteMediaInBanner);
  const createMediaInBanner = useSingleAsync(bannerPresenter.createMediaInBanner);

  const SELECT_BANNER = [
    { label: formatMessage('banner.outside'), value: 0 },
    { label: formatMessage('banner.0-6'), value: 1 },
    { label: formatMessage('banner.6-12'), value: 2 },
    { label: formatMessage('banner.right.old'), value: 3 },
    { label: formatMessage('banner.right.family'), value: 4 },
    { label: formatMessage('banner.left.combo'), value: 5 },
    { label: formatMessage('banner.right.combo'), value: 6 },
    { label: formatMessage('banner.tv.specific'), value: 7 },
    { label: formatMessage('banner.tv.0to6'), value: 8 },
    { label: formatMessage('banner.tv.6to12'), value: 9 },
    { label: formatMessage('banner.tv.adult'), value: 10 },
    { label: formatMessage('banner.tv.family1'), value: 11 },
    { label: formatMessage('banner.tv.family2'), value: 12 },
    { label: formatMessage('banner.tv.fridge'), value: 13 },
    { label: formatMessage('banner.3-doctors'), value: 14 },
  ];

  const [typeModal, setTypeModal] = useState<'EDIT' | 'ADD'>('ADD');
  // JUST FORM
  const formContent: IFormContent[] = React.useMemo<IFormContent[]>(() => {
    return [
      {
        name: 'name',
        label: 'banner.name',
        rules: [{ required: true }],
      },
      {
        name: 'bannerCode',
        label: 'banner.bannerCode',
        rules: [{ required: true }],
      },
      {
        name: 'position',
        label: 'banner.name.position',
        rules: [{ required: true }],
        render: text => (
          <Select
            disabled={modal.isReadOnly}
            placeholder={text}
            options={SELECT_BANNER.map(it => {
              return {
                value: it.value,
                label: it.label,
              };
            })}
          />
        ),
      },
    ];
  }, [modal.isReadOnly]);

  useEffect(() => {
    if (modal.dataEdit !== null) {
      setTypeModal('EDIT');
      form.setFieldsValue(modal.dataEdit);
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

  const onFinish = (value: any) => {
    value.background = value.background && value.background.file;
    value.bannerMedias =
      value.bannerMedias &&
      value.bannerMedias.map((banner, idx) => {
        const newBanner = {
          name: banner.name == undefined ? '' : banner.name,
          file: banner.file.file,
          id: banner.id,
          index: idx,
        };
        return newBanner;
      });

    const bannerMedias = value.bannerMedias.filter(banner => banner.id !== undefined);
    const bannerMediasFile = value.bannerMedias.filter(
      banner => banner.file !== undefined && !banner.id
    );
    const newValue = { ...value, bannerMedias };
    const valueBanner = { ...value, bannerMedias: bannerMediasFile };

    if (typeModal == 'EDIT') {
      bannerMediasFile.length > 0 &&
        createMediaInBanner.execute(modal.dataEdit.id, valueBanner).then(() => handleCancel());
      bannerMediasFile.length > 0
        ? updateBanner.execute(modal.dataEdit.id, newValue)
        : updateBanner.execute(modal.dataEdit.id, newValue).then(() => handleCancel());
    } else {
      createBanner.execute(value).then(() => handleCancel());
    }
  };

  const handleDeleteMedia = (bannerMediaIds: number) => {
    const newBannerMediaIds = {
      bannerMediaIds: [bannerMediaIds],
    };
    deleteMediaInBanner.execute(modal.dataEdit?.id, newBannerMediaIds).then(() => handleCancel());
  };

  const translateFirstKey = 'banner'; //put your translate here

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
          formName="form-banner"
          nameButtonSubmit={typeModal == 'EDIT' ? 'common.update' : 'common.add'}
          onCancelForm={() => handleCancel()}
          onOk={() => handleOk()}
          isLoading={isCheckLoading([createBanner, updateBanner, createMediaInBanner])}
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
        <Form.Item name="background" label={formatMessage('banner.background')}>
          <Upload disabled={modal.isReadOnly} beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />} />
          </Upload>
        </Form.Item>
        {modal.dataEdit?.background && (
          <img src={modal.dataEdit.background} width={100} height={100} />
        )}
        <div className="form_list">
          <div className="title_upload my-2">{formatMessage('banner.title.bannerMedias')}</div>
          <Form.List name="bannerMedias">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  return (
                    <div key={key} className="wrapper__field">
                      <Form.Item {...restField} name={[name, 'name']} style={{ width: '70%' }}>
                        <Input
                          placeholder={formatMessage('banner.placeholder.bannerMedias')}
                          disabled={modal.isReadOnly}
                          autoComplete="off"
                        />
                      </Form.Item>
                      {modal.dataEdit && modal.dataEdit.bannerMedias[key]?.type === 'image' && (
                        <Image
                          src={modal.dataEdit.bannerMedias[key].file}
                          className="img-banner"
                          preview
                        />
                      )}
                      {modal.dataEdit && modal.dataEdit.bannerMedias[key]?.type === 'video' && (
                        <video
                          src={modal.dataEdit && modal.dataEdit.bannerMedias[key]?.file}
                          className="img-banner"
                        />
                      )}
                      <Form.Item {...restField} name={[name, 'file']} rules={[{ required: true }]}>
                        <Upload
                          beforeUpload={() => false}
                          disabled={modal.isReadOnly}
                          maxCount={1}
                          showUploadList={{ showRemoveIcon: false }}
                        >
                          <Button className="btn">
                            <UploadOutlined />
                          </Button>
                        </Upload>
                      </Form.Item>
                      {!modal.isReadOnly && (
                        <MinusCircleOutlined
                          onClick={
                            typeModal == 'ADD'
                              ? () => remove(name)
                              : () => {
                                  modal.dataEdit.bannerMedias[key]?.id
                                    ? DeleteConfirm({
                                        title: formatMessage('banner.media.confirm.title.delete'),
                                        content: formatMessage(
                                          'banner.media.confirm.content.delete'
                                        ),
                                        handleOk: () => {
                                          handleDeleteMedia(modal.dataEdit.bannerMedias[key]?.id);
                                        },
                                      })
                                    : remove(name);
                                }
                          }
                        />
                      )}
                    </div>
                  );
                })}
                {fields.length < 10 && !modal.isReadOnly && (
                  <Button type="dashed" onClick={() => add()} block>
                    <PlusOutlined />
                    {formatMessage('banner.add.media')}
                  </Button>
                )}
              </>
            )}
          </Form.List>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalBanner;
