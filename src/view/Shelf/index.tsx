import { Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { generatePath, useHistory } from 'react-router-dom';

import CheckPermission from '@hoc/CheckPermission';
import RightMenu, { IArrayAction } from '@layout/RightMenu';
import { SHELFS_PERMISSION } from '@modules/shelf/contants';
import shelfPresenter from '@modules/shelf/presenter';
import DeleteIconComponent from '@shared/components/DeleteIcon';
import EditIconComponent from '@shared/components/EditIconComponent';
import InformationIconComponent from '@shared/components/InformationIcon';
import MainTitleComponent from '@shared/components/MainTitleComponent';
import SearchComponent from '@shared/components/SearchComponent/SearchComponent';
import TableComponent from '@shared/components/TableComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useAltaIntl } from '@shared/hook/useTranslate';

import ModalComponents from './component/MainModal/ModalShelf';
import { IModal } from './interface';
import {
  routerFormAddShelf,
  routerFormInfoShelf,
  routerFormUpdateShelf
} from './page/FormShelf/router';
import { routerShelf } from './router';

const Shelf = () => {
  const { formatMessage } = useAltaIntl();
  const table = useTable();
  const history = useHistory();
  const [modal, setModal] = useState<IModal>({
    isVisible: false,
    dataEdit: null,
    isReadOnly: false,
  });
  const [search, setSearch] = useState<string>('');

  const idChooses = 'id'; //get your id here. Ex: accountId, userId,...
  const columns: ColumnsType = [
    {
      dataIndex: 'name',
      sorter: true,
    },
    {
      dataIndex: 'code',
    },
    {
      dataIndex: 'createdAt',
      sorter: true,
    },
    {
      dataIndex: 'action',
      render: (item, record: any, index) => (
        <Space>
          <CheckPermission permissionCode={SHELFS_PERMISSION.UPDATE}>
            <EditIconComponent
              onClick={() => {
                history.push(generatePath(routerFormUpdateShelf.path, { id: record.id }));
              }}
            />
          </CheckPermission>

          <CheckPermission permissionCode={SHELFS_PERMISSION.VIEW}>
            <InformationIconComponent
              onClick={() => {
                history.push(generatePath(routerFormInfoShelf.path, { id: record.id }));
              }}
            />
          </CheckPermission>

          {/* <DeleteIconComponent
            onClick={() => {
              return DeleteConfirm({
                content: formatMessage('common.delete'),
                handleOk: () => {
                  shelfPresenter.deleteShelf(record.id).then(() => {
                    handleRefresh();
                  });
                },
                handleCancel: () => {},
              });
            }}
          /> */}
        </Space>
      ),
    },
  ];

  const arrayAction: IArrayAction[] = [
    {
      iconType: 'add',
      handleAction: () => {
        history.push(generatePath(routerFormAddShelf.path));
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
    <div className="shelf">
      <MainTitleComponent breadcrumbs={routerShelf} />
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
          apiServices={shelfPresenter.getListShelf}
          translateFirstKey="shelf"
          rowKey={res => res[idChooses]}
          register={table}
          columns={columns}
          hasStt={true}
          disableFirstCallApi={true}
        />
      </div>
      {/* <CheckPermission permissionCode={SHELFS_PERMISSION.CREATE}>
        <RightMenu arrayAction={arrayAction} />
      </CheckPermission>
      <ModalComponents modal={modal} handleRefresh={handleRefresh} setModal={setModal} /> */}
    </div>
  );
};

export default Shelf;
