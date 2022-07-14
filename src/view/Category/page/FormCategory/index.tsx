import { Button, Col, Form, Input, Row, Space, Upload } from 'antd';
import { arrayMoveImmutable } from 'array-move';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableHandle,
  SortEnd
} from 'react-sortable-hoc';

import { MenuOutlined, UploadOutlined } from '@ant-design/icons';
import CategoryEntity from '@modules/category/entity';
import categoryPresenter from '@modules/category/presenter';
import ProductEntity from '@modules/product/entity';
import ButtonForm from '@shared/components/ButtonForm';
import DeleteIconComponent from '@shared/components/DeleteIcon';
import MainTitleComponent from '@shared/components/MainTitleComponent';
import TableComponent from '@shared/components/TableComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useAltaIntl } from '@shared/hook/useTranslate';
import { routerCategory } from '@view/Category/router';

import ModalFormCategory from './component/MainModal/ModalFormCategory';
import { IModal } from './interface';
import { routerFormAddCategory, routerFormInfoCategory, routerFormUpdateCategory } from './router';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));

const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

const FormCategory = () => {
  const { formatMessage, intl } = useAltaIntl();
  const history = useHistory();
  const table = useTable();
  const { id, status } = useParams<{ id: string; status: string }>();
  const [form] = Form.useForm();
  const [modal, setModal] = useState<IModal>({
    isVisible: false,
    dataEdit: null,
    isReadOnly: false,
  });
  const [dataChoice, setDataChoice] = useState<(ProductEntity | undefined)[]>([]);

  const disabled = status == 'info' ? true : false;

  useEffect(() => {
    categoryPresenter.getDetailCategory(id).then((res: CategoryEntity) => {
      form.setFieldsValue(res);
      setDataChoice(res.productRecommends);
    });
  }, [status, id]);

  const columns = [
    {
      title: '',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      dataIndex: 'name',
      title: 'category.label',
    },
    {
      dataIndex: 'createdAt',
      width: '20rem',
      align: 'center',
    },
    {
      dataIndex: 'action',
      align: 'center',
      width: '20rem',
      render(_, record) {
        return (
          <Space>
            <DeleteIconComponent
              disable={disabled}
              onClick={() => {
                onDelete(record);
              }}
            />
          </Space>
        );
      },
    },
  ];

  const onDelete = (data: ProductEntity) => {
    setDataChoice(frev => frev.filter(item => item?.id !== data.id));
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    history.push(routerCategory.path);
  };

  const onFinish = value => {
    //thêm xóa sửa value here
    const formSend = { ...value };
    if (formSend.image) {
      formSend.image = formSend.image.file;
    }
    formSend.productRecommends = dataChoice.map((data, index) => {
      return { productId: data?.id, productIndex: index };
    });
    if (id) {
      categoryPresenter.updateCategory(id, formSend).then(() => {
        history.push(routerCategory.path);
      });
    } else {
      categoryPresenter.createCategory(formSend).then(() => {
        history.push(routerCategory.path);
      });
    }
  };

  const handleFinish = (data: (ProductEntity | undefined)[]) => {
    setDataChoice(data);
  };

  const showBreadcrumbs = (id, status) => {
    if (id) {
      if (status == 'info') {
        return [routerCategory, routerFormInfoCategory];
      }
      return [routerCategory, routerFormUpdateCategory];
    } else {
      return [routerCategory, routerFormAddCategory];
    }
  };

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataChoice.slice(), oldIndex, newIndex).filter(el => !!el);
      setDataChoice(newData);
    }
  };

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataChoice.findIndex(x => x?.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <div className="form-category">
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
              <Form.Item
                //@ts-ignore
                label={formatMessage('category.label')}
                name="name"
              >
                <Input
                  placeholder={formatMessage('category.label.placeholder')}
                  readOnly={disabled}
                />
              </Form.Item>

              <Form.Item label={formatMessage('category.image')} name="image">
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
              <img src={form.getFieldValue('image')} className="category-img" />
            </Col>
            <Col span={16}>
              <div className="upload-product">{formatMessage('category.product')}</div>
              {dataChoice.length !== 0 && (
                <TableComponent
                  translateFirstKey="category"
                  rowKey={res => res.id}
                  register={table}
                  columns={columns}
                  dataSource={dataChoice}
                  scroll={{ y: '60vh' }}
                  pagination={false}
                  className="mb-3"
                  components={{
                    body: {
                      wrapper: DraggableContainer,
                      row: DraggableBodyRow,
                    },
                  }}
                />
              )}
              <div
                onClick={() => {
                  setModal({ ...modal, isVisible: true });
                }}
                className={`category-add ${disabled ? 'd-none' : ''}`}
              >
                {formatMessage('category.product.add')}
              </div>
            </Col>
          </Row>
          <ButtonForm
            formName="form-product"
            nameButtonSubmit={id ? 'common.update' : 'common.add'}
            className="my-5"
            isDisabled={disabled}
            onOk={handleOk}
            onCancelForm={handleCancel}
          />
        </Form>
        <ModalFormCategory
          modal={modal}
          setModal={setModal}
          handleFinish={handleFinish}
          dataChoice={dataChoice}
        />
      </div>
    </div>
  );
};

export default FormCategory;
