import { Space } from 'antd';
import React, { useEffect, useState } from 'react';

import CheckPermission from '@hoc/CheckPermission';
import RightMenu, { IArrayAction } from '@layout/RightMenu';
import { USERS_PERMISSION } from '@modules/user/contants';
import UserEntity from '@modules/user/entity';
import userPresenter from '@modules/user/presenter';
import BadgeBoolean from '@shared/components/BadgeBoolean';
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

import ModalComponents from './component/MainModal/ModalUser';
import { IModal } from './interface';
import { routerUser } from './router';

const User = () => {
  const { formatMessage } = useAltaIntl();
  const table = useTable();
  const deleteUser = useSingleAsync(userPresenter.deleteUser);

  const [modal, setModal] = useState<IModal>({
    isVisible: false,
    dataEdit: null,
    isReadOnly: false,
  });

  const [search, setSearch] = useState<string>('');

  const idChooses = 'id';
  const columns = [
    {
      dataIndex: 'fullName',
      sorter: true,
    },
    {
      dataIndex: 'emailAddress',
      sorter: true,
    },
    {
      dataIndex: 'createdAt',
      sorter: true,
    },
    {
      dataIndex: 'active',
      render: text => <BadgeBoolean status={text} id="customer.status.param" />,
    },
    {
      dataIndex: 'action',
      render: (item, record: UserEntity, index) => (
        <Space>
          <CheckPermission permissionCode={USERS_PERMISSION.UPDATE}>
            <EditIconComponent
              onClick={() => {
                setModal({
                  dataEdit: record,
                  isVisible: true,
                  isReadOnly: false,
                });
              }}
            />
          </CheckPermission>

          <CheckPermission permissionCode={USERS_PERMISSION.VIEW}>
            <InformationIconComponent
              onClick={() => {
                setModal({
                  dataEdit: record,
                  isVisible: true,
                  isReadOnly: true,
                });
              }}
            />
          </CheckPermission>

          <CheckPermission permissionCode={USERS_PERMISSION.DELETE}>
            <DeleteIconComponent
              onClick={() => {
                DeleteConfirm({
                  title: formatMessage('customer.confirm.title.delete'),
                  content: formatMessage('common.confirm.content.delete'),
                  handleOk: () => {
                    deleteUser?.execute(record.id).then(() => {
                      handleRefresh();
                    });
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
      permissionCode: USERS_PERMISSION.CREATE,
      handleAction: () => {
        setModal({ dataEdit: null, isVisible: true });
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
    <div className="user">
      <MainTitleComponent breadcrumbs={routerUser} />
      <div className="main-card">
        <div className="d-flex flex-row justify-content-md-between mb-3 align-items-end">
          <div className="d-flex flex-column"></div>
          <div className="d-flex flex-column ">
            <div className="label-select">{formatMessage('common.keyword')}</div>
            <SearchComponent onSearch={handleSearch} placeholder={'common.keyword'} />
          </div>
        </div>
        <TableComponent
          apiServices={userPresenter.getUser}
          translateFirstKey="user"
          rowKey={res => res[idChooses]}
          register={table}
          columns={columns}
          hasStt={true}
        />
      </div>
      <RightMenu arrayAction={arrayAction} />
      <ModalComponents modal={modal} handleRefresh={handleRefresh} setModal={setModal} />
    </div>
  );
};

export default User;
