import { Button, Col, Form, Modal, Row, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { arrayMoveImmutable } from 'array-move';
import React, { useEffect, useState } from 'react';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableHandle,
  SortEnd
} from 'react-sortable-hoc';

import { MenuOutlined } from '@ant-design/icons';
import ProductEntity from '@modules/product/entity';
import productPresenter from '@modules/product/presenter';
import ButtonForm from '@shared/components/ButtonForm';
import DeleteIconComponent from '@shared/components/DeleteIcon';
import SearchComponent from '@shared/components/SearchComponent/SearchComponent';
import TableComponent from '@shared/components/TableComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useAltaIntl } from '@shared/hook/useTranslate';

import { IPropsModal } from '../../interface';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

const SortableItem = SortableElement((props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...props} />
));

const SortableBody = SortableContainer((props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody {...props} />
));

const ModalFormCategory = (props: IPropsModal) => {
  const { modal, setModal, handleFinish } = props;
  const [form] = Form.useForm();
  const { formatMessage, intl } = useAltaIntl();
  const table = useTable();
  const [dataChoice, setDataChoice] = useState<any[]>([]);

  const [data, setData] = useState<ProductEntity[]>([]);
  const [dataSource, setDataSource] = useState<ProductEntity[]>([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  useEffect(() => {
    productPresenter.getListProduct().then(result => {
      setDataSource(result.data);
      setData(result.data);
    });
  }, [modal.isVisible]);

  useEffect(() => {
    setDataChoice(props.dataChoice);
  }, [props.dataChoice, modal.isVisible]);

  const columnsData: ColumnsType = [
    {
      dataIndex: 'name',
      title: 'product.title',
    },
  ];

  const columnsChoice = [
    {
      title: '',
      width: '3rem',
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      dataIndex: 'name',
      title: 'category.label',
    },
    {
      dataIndex: 'action',
      align: 'center',
      width: '10rem',
      render(_, record) {
        return (
          <Space>
            <DeleteIconComponent
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

  const unique = (array: Array<ProductEntity>) => {
    const newArray: Array<ProductEntity> = [];
    array.forEach(item => {
      if (!newArray.some(it => it.id && it.id === item.id)) {
        newArray.push(item);
      }
    });
    return newArray;
  };

  const onAdd = () => {
    const _data = selectedRowKeys.map(id => data.find(item => item.id === id));
    setDataChoice(f => unique([...f, ..._data]));
    setSelectedRowKeys([]);
  };

  const handleOk = () => {
    handleFinish(dataChoice);
    setModal({ isVisible: false });
  };

  const handleCancel = () => {
    setModal({ isVisible: false });
  };

  const handleSearch = (searchKey: string) => {
    const _dataSource = data.filter(
      item => item.name.toLowerCase().search(searchKey.toLowerCase()) != -1
    );
    setDataSource(_dataSource);
  };

  const rowClassName = record => {
    const isHave = dataChoice.find(item => item.id === record.id);
    if (Boolean(isHave)) {
      return 'disabled-row';
    }
    return '';
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
    <Modal
      className="main-modal category-modal"
      title={formatMessage('category.add')}
      visible={modal.isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <ButtonForm
          isDisabled={modal.isReadOnly ? true : false}
          formName="form-device"
          nameButtonSubmit="common.add"
          onCancelForm={() => handleCancel()}
          onOk={() => handleOk()}
        />
      }
      closable={false}
      destroyOnClose={true}
    >
      <SearchComponent onSearch={handleSearch} placeholder={'common.keyword'} />
      <Row gutter={[8, 8]}>
        <Col span={11}>
          <TableComponent
            // apiServices={productPresenter.getListProduct}
            translateFirstKey="category"
            dataSource={dataSource}
            rowKey={res => res.id}
            register={table}
            columns={columnsData}
            scroll={{ y: '60rem' }}
            rowClassName={rowClassName}
            // @ts-ignore
            onRowSelect={setSelectedRowKeys}
            selectedRowKeys={selectedRowKeys}
            pagination={false}
          />
        </Col>
        <Col span={2}>
          <Button className="btn__add" onClick={onAdd}>
            {'>>>'}
          </Button>
        </Col>
        <Col span={11}>
          <TableComponent
            translateFirstKey="category"
            dataSource={dataChoice}
            rowKey={res => res.id}
            register={table}
            columns={columnsChoice}
            scroll={{ y: '60rem' }}
            pagination={false}
            components={{
              body: {
                wrapper: DraggableContainer,
                row: DraggableBodyRow,
              },
            }}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalFormCategory;
