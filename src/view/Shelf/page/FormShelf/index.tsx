import { Button, Col, Form, InputNumber, Row, Upload } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { FormContent, IFormContent } from '@hoc/FormHelper';
import RightMenu, { IArrayAction } from '@layout/RightMenu';
import ShelfEntity, { ShelfProductDetailEntity } from '@modules/shelf/entity';
import shelfPresenter from '@modules/shelf/presenter';
import ButtonForm from '@shared/components/ButtonForm';
import MainTitleComponent from '@shared/components/MainTitleComponent';
import TableComponent from '@shared/components/TableComponent';
import { useAltaIntl } from '@shared/hook/useTranslate';
import { routerShelf } from '@view/Shelf/router';

import ModalComponents from './component/MainModal/ModalTableShelf';
import UploadVideo from './component/UploadVideo';
import { ITableModal } from './interface';
import { routerFormAddShelf, routerFormInfoShelf, routerFormUpdateShelf } from './router';

const AddShelf = () => {
  const { formatMessage, intl } = useAltaIntl();
  const history = useHistory();
  const [form] = Form.useForm();
  const { id, status } = useParams<{ id: string; status: string }>();

  const [modal, setModal] = useState<ITableModal>({
    isVisible: false,
    dataEdit: [],
    isReadOnly: false,
    isCreateNew: false,
  });

  const disabled = status == 'info' ? true : false;

  useEffect(() => {
    if (id)
      shelfPresenter.getDetailShelf(id).then((res: ShelfEntity) => {
        form.setFieldsValue(res);
        setModal({
          isVisible: false,
          dataEdit: res.shelfProducts,
        });
        return;
      });
  }, [status, id]);

  const formContent: IFormContent[] = React.useMemo<IFormContent[]>(() => {
    return [
      {
        name: 'name',
        label: 'shelf.name',
        rules: [{ required: true }],
        readOnly: disabled,
      },
      {
        name: 'position',
        label: 'shelf.position',
        rules: [{ required: true }],
        readOnly: true,
        render: text => <InputNumber placeholder={text} />,
      },
      {
        name: 'code',
        label: 'shelf.code',
        rules: [{ required: true }],
        readOnly: true,
      },
      {
        name: 'query',
        label: 'shelf.query',
        rules: [{ required: true }],
        readOnly: true,
      },
    ];
  }, [modal.isReadOnly, modal.dataEdit]);

  const columns: ColumnsType<ShelfProductDetailEntity> = [
    {
      title: 'product.name',
      dataIndex: 'name',
      render: (item, record) => record.product.name,
    },
    {
      title: 'product.xDirection',
      dataIndex: 'xDirection',
      render: (item, record) => item || 0,
    },
    {
      title: 'product.yDirection',
      dataIndex: 'yDirection',
      render: (item, record) => item || 0,
    },
    {
      title: 'product.preferredProduct',
      dataIndex: 'zDirection',
      render: (item, record) => item,
    },
  ];

  const handleUpdateProduct = () => {
    setModal(prev => ({ ...prev, isVisible: true, isCreateNew: false }));
  };

  const arrayAction: IArrayAction[] = [
    {
      iconType: 'edit',
      handleAction: () => {
        handleUpdateProduct();
      },
    },
  ];

  const onFinish = value => {
    //thêm xóa sửa value here
    value.image = value.image && value.image.file;
    const productArr = modal.dataEdit.map((it: ShelfProductDetailEntity) => ({
      productId: it.product.id,
      xDirection: it.xDirection || 0,
      yDirection: it.yDirection || 0,
      zDirection: it.zDirection || 0,
    }));

    const formSend = {
      ...value,
      shelfProducts: productArr,
    };

    if (status == 'update') {
      shelfPresenter.updateShelf(id, formSend).then(() => {
        handleCancel();
      });
    } else {
      shelfPresenter.createShelf(formSend).then(() => {
        handleCancel();
      });
    }
  };

  const handleAddProduct = () => {
    if (status == 'update') {
      setModal(prev => ({ ...prev, isVisible: true, isReadOnly: false }));
    } else {
      setModal(prev => ({
        ...prev,
        dataEdit: prev.dataEdit ? prev.dataEdit : [],
        isVisible: true,
        isCreateNew: true,
      }));
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    history.push(routerShelf.path);
  };

  const showBreadcrumbs = (id, status) => {
    if (id) {
      if (status == 'info') {
        return [routerShelf, routerFormInfoShelf];
      }
      return [routerShelf, routerFormUpdateShelf];
    } else {
      return [routerShelf, routerFormAddShelf];
    }
  };

  return (
    <div className="add-shelf">
      <MainTitleComponent breadcrumbs={showBreadcrumbs(id, status)} />
      <div className="main-card">
        <Form
          form={form}
          className="main-form" //important
          layout="vertical" //important
          name="basic"
          onFinish={onFinish}
        >
          <Row gutter={[24, 24]}>
            <Col span={8}>
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
              <>
                <Form.Item label={formatMessage('shelf.image')} name="image">
                  {!disabled && (
                    <Upload
                      beforeUpload={() => false}
                      maxCount={1}
                      listType="picture"
                      showUploadList={{ showRemoveIcon: false }}
                    >
                      <Button icon={<UploadOutlined />}>{formatMessage('user.upload')}</Button>
                    </Upload>
                  )}
                </Form.Item>
                {form.getFieldValue('image') && (
                  <img src={form.getFieldValue('image')} width={150} height={200} />
                )}
              </>
            </Col>
            <Col span={16}>
              <Form.Item
                key="shelfProduct"
                label={formatMessage('shelf.shelfProduct')}
                name="shelfProduct"
              >
                <div className="table-product d-flex flex-column ">
                  {/* {modal.dataEdit.length > 0 && ( */}
                  <TableComponent
                    hasStt
                    columns={columns}
                    dataSource={modal.dataEdit}
                    scroll={{ y: '60vh' }}
                    pagination={false}
                    rowKey={record => record.product.id}
                  />
                  {/* )} */}
                  {!id && modal.dataEdit.length < 1 && (
                    <div>
                      <Button icon={<PlusOutlined />} onClick={handleAddProduct}>
                        {formatMessage('common.add')}
                      </Button>
                    </div>
                  )}
                </div>
              </Form.Item>
            </Col>
          </Row>
          <ButtonForm
            isDisabled={disabled}
            formName="form-device"
            nameButtonSubmit={id ? 'common.update' : 'common.add'}
            onCancelForm={handleCancel}
            onOk={handleOk}
          />
        </Form>
      </div>
      <ModalComponents modal={modal} setModal={setModal} form={form} onFinish={onFinish} />
      {((id && status !== 'info') || (status !== 'info' && modal.dataEdit.length > 0)) && (
        <RightMenu arrayAction={arrayAction} />
      )}
    </div>
  );
};

export default AddShelf;
