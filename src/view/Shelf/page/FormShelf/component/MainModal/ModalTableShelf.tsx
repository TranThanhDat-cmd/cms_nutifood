import { Badge, Col, Modal, Row, Space, Tooltip } from 'antd';
import table, { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';

import { FileAddOutlined } from '@ant-design/icons';
import { uuidv4 } from '@antv/xflow-core';
import ProductEntity from '@modules/product/entity';
import productPresenter from '@modules/product/presenter';
import { ShelfProductDetailEntity } from '@modules/shelf/entity';
import ButtonForm from '@shared/components/ButtonForm';
import DeleteIconComponent from '@shared/components/DeleteIcon';
import SearchComponent from '@shared/components/SearchComponent/SearchComponent';
import TableComponent from '@shared/components/TableComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useAltaIntl } from '@shared/hook/useTranslate';

import { IPropsModal } from '../../interface';
import EditableInputCell from '../EditableInputCell';

const ModalAddShelf = (props: IPropsModal) => {
  const { modal, setModal } = props;
  const table = useTable();
  const { formatMessage, intl } = useAltaIntl();
  const [dataSource, setDataSource] = useState<ShelfProductDetailEntity[]>([]);

  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (modal.isCreateNew) {
      setDataSource([]);
      return;
    }
    // the product that shelf already have it in when we are in update router or after create it
    setDataSource(modal.dataEdit);
  }, [modal.isCreateNew, modal.dataEdit]);

  // JUST FORM
  const columns: ColumnsType<ProductEntity> = [
    {
      dataIndex: 'name',
    },
    {
      dataIndex: 'createdAt',
    },
    {
      dataIndex: 'status',
      render: (item, record, index) =>
        dataSource.filter(item => item.product.id === record.id).length > 0 ? (
          <Badge count={dataSource.filter(item => item.product.id === record.id).length} />
        ) : (
          <Tooltip placement="topLeft" title={formatMessage('shelf.shelfProduct.addButton')}>
            <FileAddOutlined size={24} style={{ cursor: 'pointer' }} />
          </Tooltip>
        ),
    },
  ];

  const columnTransfer: ColumnsType<ShelfProductDetailEntity> = [
    {
      title: 'product.name',
      dataIndex: 'name',
      render: (item, record) => record.product.name,
    },
    {
      title: 'product.xDirection',
      dataIndex: 'xDirection',
      render: (item, record, index) => (
        <EditableInputCell
          name="xDirection"
          itemCell={item}
          record={record}
          indexRow={index}
          setDataSource={setDataSource}
        />
      ),
    },
    {
      title: 'product.yDirection',
      dataIndex: 'yDirection',
      render: (item, record, index) => (
        <EditableInputCell
          name="yDirection"
          itemCell={item}
          record={record}
          setDataSource={setDataSource}
          indexRow={index}
        />
      ),
    },
    {
      title: 'product.preferredProduct',
      dataIndex: 'zDirection',
      render: (item, record, index) => (
        <EditableInputCell
          name="zDirection"
          itemCell={item}
          record={record}
          setDataSource={setDataSource}
          indexRow={index}
        />
      ),
    },
    {
      title: 'product.action',
      dataIndex: 'action',
      render: (item, record: any, index) => {
        return (
          <Space>
            <DeleteIconComponent
              onClick={() => {
                setDataSource(prev => prev.filter((item, id) => id !== index));
              }}
            />
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    if (modal.isVisible) table.fetchData({ option: { search: search } });
  }, [modal.isVisible, search]);

  const handleSearch = (searchKey: string) => {
    setSearch(searchKey);
  };

  const handleCancel = () => {
    setModal(prev => ({
      ...prev,
      isVisible: false,
    }));
  };

  const handleOk = () => {
    props.form.submit();
    props.onFinish;
    setModal({
      isVisible: false,
      dataEdit: dataSource,
    });
    setDataSource([]);
  };

  const handleAddProduct = (record: ProductEntity, index) => {
    setDataSource(prev => [
      ...prev,
      {
        product: record,
        xDirection: 0,
        yDirection: 0,
        zDirection: 0,
        productId: record.id,
      },
    ]);
  };

  const onRow = (record, index) => {
    return {
      onClick: () => handleAddProduct(record, index),
    };
  };

  return (
    <Modal
      className="main-modal w-100"
      title={formatMessage('addShelf.product')}
      visible={modal.isVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={
        <ButtonForm
          isDisabled={modal.isReadOnly ? true : false}
          formName="form-device"
          nameButtonSubmit={modal.isCreateNew ? 'common.add' : 'common.update'}
          onCancelForm={() => handleCancel()}
          onOk={() => handleOk()}
        />
      }
      closable={false}
    >
      <div className="d-flex flex-row justify-content-md-between mb-3 align-items-end">
        <div className="d-flex flex-column ">
          <div className="label-select">{formatMessage('common.keyword')}</div>
          <SearchComponent onSearch={handleSearch} placeholder={'common.keyword'} />
        </div>
      </div>
      <div className="d-block w-100">
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <TableComponent
              apiServices={productPresenter.getListProduct}
              translateFirstKey="product"
              rowKey={res => res['id']} // each row should have unique 'key' props
              columns={columns}
              register={table}
              onRow={onRow}
              disableFirstCallApi={true}
              scroll={{ y: '60vh' }}
              // pagination={false}
            />
          </Col>
          <Col span={12}>
            <TableComponent
              dataSource={dataSource}
              columns={columnTransfer}
              rowKey={res => uuidv4()}
              rowClassName={() => 'editable-row'}
              scroll={{ y: '60vh' }}
              pagination={false}
              disableFirstCallApi={true}
            />
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default ModalAddShelf;
