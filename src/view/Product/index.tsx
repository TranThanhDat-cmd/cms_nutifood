import './style.scss';

import { DatePicker, Space, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';

import CheckPermission from '@hoc/CheckPermission';
import RightMenu, { IArrayAction } from '@layout/RightMenu';
import { PRODUCTS_PERMISSION } from '@modules/product/contants';
import productPresenter from '@modules/product/presenter';
import { DeleteConfirm } from '@shared/components/ConfirmDelete';
import DeleteIconComponent from '@shared/components/DeleteIcon';
import EditIconComponent from '@shared/components/EditIconComponent';
import InformationIconComponent from '@shared/components/InformationIcon';
import MainTitleComponent from '@shared/components/MainTitleComponent';
import SearchComponent from '@shared/components/SearchComponent/SearchComponent';
import TableComponent from '@shared/components/TableComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useSingleAsync } from '@shared/hook/useAsync';
import { useAltaIntl } from '@shared/hook/useTranslate';

import {
  routerFormAddProduct,
  routerFormInfoProduct,
  routerFormUpdateProduct
} from './page/FormProduct/router';
import { routerProduct } from './router';

const Product = () => {
  const table = useTable();
  const history = useHistory();
  const { formatMessage } = useAltaIntl();

  const [search, setSearch] = useState<string>('');
  const [filter, setFilterOption] = useState<{}>();
  const deleteProduct = useSingleAsync(productPresenter.deleteProduct);
  const [rangeDate, setRangeDate] = useState<any>(null);

  const idChooses = 'productId';
  const columns: ColumnsType = [
    {
      dataIndex: 'name',
      render: text => <div className="product__table-normal">{text}</div>,
      sorter: true,
    },
    {
      dataIndex: 'nutritionInfo',
      sorter: true,
      render: textInfo => (
        <div className="product__table" dangerouslySetInnerHTML={{ __html: textInfo }} />
      ),
    },
    {
      dataIndex: 'buyLink',
      sorter: true,
      render: text => (
        <a className="product__table-normal" href={text} target="_blank">
          {text}
        </a>
      ),
    },
    {
      dataIndex: 'createdAt',
      sorter: true,
    },
    {
      dataIndex: 'action',
      render: (item, record: any) => (
        <Space>
          <CheckPermission permissionCode={PRODUCTS_PERMISSION.UPDATE}>
            <EditIconComponent
              onClick={() =>
                history.push(generatePath(routerFormUpdateProduct.path, { id: record.id }))
              }
            />
          </CheckPermission>
          <CheckPermission permissionCode={PRODUCTS_PERMISSION.VIEW}>
            <InformationIconComponent
              onClick={() =>
                history.push(generatePath(routerFormInfoProduct.path, { id: record.id }))
              }
            />
          </CheckPermission>
          <CheckPermission permissionCode={PRODUCTS_PERMISSION.DELETE}>
            <DeleteIconComponent
              onClick={() => {
                DeleteConfirm({
                  title: formatMessage('product.confirm.title.delete'),
                  content: formatMessage('product.confirm.content.delete'),
                  handleOk: () => {
                    deleteProduct?.execute(record.id).then(() => handleRefresh());
                  },
                });
              }}
            />
          </CheckPermission>
        </Space>
      ),
    },
  ];

  const arrayAction: IArrayAction[] = [
    {
      iconType: 'add',
      permissionCode: PRODUCTS_PERMISSION.CREATE,
      handleAction: () => {
        history.push(routerFormAddProduct.path);
      },
    },
  ];

  useEffect(() => {
    if (rangeDate !== null) {
      table.fetchData({
        option: {
          search: search,
          from: moment(rangeDate).format('YYYY-MM-DD'),
          to: moment().format('YYYY-MM-DD'),
          ...filter,
        },
      });
    } else {
      table.fetchData({ option: { search: search, filter: { ...filter } } });
    }
  }, [search, filter, rangeDate, setRangeDate]);

  const handleRefresh = () => {
    table.fetchData({
      option: {
        search: search,
        from: moment(rangeDate).format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD'),
      },
    });
  };

  const handleSearch = (searchKey: string) => {
    setSearch(searchKey);
  };

  const onChangeRangePicker = (date: any) => {
    if (date === null) {
      setRangeDate(null);
    } else {
      setRangeDate(date);
    }
  };
  return (
    <div className="product">
      <MainTitleComponent breadcrumbs={routerProduct} />
      <div className="main-card">
        <div className="d-flex flex-row justify-content-md-between mb-3 align-items-end">
          <div className="d-flex flex-column date_picker">
            <Typography.Text className="label-select">
              {formatMessage('product.rangeTime')}
            </Typography.Text>
            <DatePicker format="DD/MM/YYYY" onChange={onChangeRangePicker} value={rangeDate} />
          </div>
          <div className="d-flex flex-column ">
            <div className="label-select">{formatMessage('common.keyword')}</div>
            <SearchComponent
              onSearch={handleSearch}
              placeholder={'common.keyword'}
              classNames="mb-0"
            />
          </div>
        </div>
        <TableComponent
          apiServices={productPresenter.getListProduct}
          defaultOption={filter}
          translateFirstKey="product"
          rowKey={res => res[idChooses]}
          register={table}
          columns={columns}
          disableFirstCallApi={true}
          hasStt={true}
        />
      </div>
      <RightMenu arrayAction={arrayAction} />
    </div>
  );
};

export default Product;
