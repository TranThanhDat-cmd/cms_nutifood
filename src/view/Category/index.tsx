import './style.scss';

import { Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';

import CheckPermission from '@hoc/CheckPermission';
import RightMenu, { IArrayAction } from '@layout/RightMenu';
import { PRODUCT_CATEGORIES_PERMISSION } from '@modules/category/contants';
import categoryPresenter from '@modules/category/presenter';
import { DeleteConfirm } from '@shared/components/ConfirmDelete';
import DeleteIconComponent from '@shared/components/DeleteIcon';
import EditIconComponent from '@shared/components/EditIconComponent';
import InformationIconComponent from '@shared/components/InformationIcon';
import MainTitleComponent from '@shared/components/MainTitleComponent';
import SearchComponent from '@shared/components/SearchComponent/SearchComponent';
import TableComponent from '@shared/components/TableComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useAltaIntl } from '@shared/hook/useTranslate';

import {
  routerFormAddCategory,
  routerFormInfoCategory,
  routerFormUpdateCategory
} from './page/FormCategory/router';
import { routerCategory } from './router';

const Category = () => {
  const { formatMessage } = useAltaIntl();
  const table = useTable();
  const history = useHistory();

  const [search, setSearch] = useState<string>('');

  const idChooses = 'id'; //get your id here. Ex: accountId, userId,...
  const columns: ColumnsType = [
    {
      dataIndex: 'name',
      title: 'category.label',
      sorter: true,
    },
    {
      dataIndex: 'createdAt',
      sorter: true,
    },
    {
      dataIndex: 'action',
      render: (item, record: any, index) => (
        <Space>
          <CheckPermission permissionCode={PRODUCT_CATEGORIES_PERMISSION.UPDATE}>
            <EditIconComponent
              onClick={() => {
                history.push(generatePath(routerFormUpdateCategory.path, { id: record.id }));
              }}
            />
          </CheckPermission>
          <CheckPermission permissionCode={PRODUCT_CATEGORIES_PERMISSION.VIEW}>
            <InformationIconComponent
              onClick={() => {
                history.push(generatePath(routerFormInfoCategory.path, { id: record.id }));
              }}
            />
          </CheckPermission>
          <CheckPermission permissionCode={PRODUCT_CATEGORIES_PERMISSION.DELETE}>
            <DeleteIconComponent
              onClick={() => {
                DeleteConfirm({
                  title: formatMessage('category.confirm.title.delete'),
                  content: formatMessage('category.confirm.content.delete'),
                  handleOk: () => {
                    categoryPresenter.deleteCategory(record.id).then(() => handleRefresh());
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
      permissionCode: PRODUCT_CATEGORIES_PERMISSION.CREATE,
      handleAction: () => {
        history.push(generatePath(routerFormAddCategory.path));
      },
    },
  ];

  useEffect(() => {
    table.fetchData({ option: { search: search } });
  }, [search]);

  const handleRefresh = () => {
    table.fetchData({ option: { search: search } });
  };

  const handleSearch = (searchKey: string) => {
    setSearch(searchKey);
  };

  return (
    <div className="category">
      <MainTitleComponent breadcrumbs={routerCategory} />
      <div className="main-card">
        <div className="d-flex flex-row justify-content-md-between mb-3 align-items-end">
          <div className="d-flex flex-column "></div>
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
          apiServices={categoryPresenter.getListCategory}
          translateFirstKey="category"
          rowKey={res => res[idChooses]}
          register={table}
          columns={columns}
          hasStt={true}
          disableFirstCallApi={true}
        />
      </div>
      <RightMenu arrayAction={arrayAction} />
    </div>
  );
};

export default Category;
