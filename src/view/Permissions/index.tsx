import { Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import CheckPermission from '@hoc/CheckPermission';
import RightMenu, { IArrayAction } from '@layout/RightMenu';
import { ROLES_PERMISSION } from '@modules/permissions/constants';
import RoleEntity from '@modules/roles/entity';
import rolePresenter from '@modules/roles/presenter';
import ButtonAdd from '@shared/components/ButtonAdd';
import { DeleteConfirm } from '@shared/components/ConfirmDelete';
import DeleteIconComponent from '@shared/components/DeleteIcon';
import EditIconComponent from '@shared/components/EditIconComponent';
import MainTitleComponent from '@shared/components/MainTitleComponent';
import SearchComponent from '@shared/components/SearchComponent/SearchComponent';
import TableComponent from '@shared/components/TableComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useSingleAsync } from '@shared/hook/useAsync';
import { toSearch, useQueryParams } from '@shared/hook/useQueryParams';
import { useAltaIntl } from '@shared/hook/useTranslate';

import { routerFormPermissions } from './page/FormPermissions/router';
import { routerPermissions } from './router';

const Permissions: React.FC = () => {
  const table = useTable();
  const location = useLocation();
  const queryParams = useQueryParams();
  const { formatMessage } = useAltaIntl();
  const history = useHistory();
  const removeRole = useSingleAsync(rolePresenter.removeRole);
  const updateStatusCode = useSingleAsync(rolePresenter.updateStatusCode);

  useEffect(() => {
    table.fetchData({
      pagination: queryParams,
    });
  }, [queryParams]);

  const columns: ColumnsType<RoleEntity> = React.useMemo(() => {
    return [
      {
        title: 'roles.name',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: 'roles.createdAt',
        dataIndex: 'createdAt',
        sorter: true,
      },

      {
        title: 'roles.action',
        dataIndex: 'action',
        render: (item, record: any, index) => (
          <Space size="large">
            <CheckPermission permissionCode={ROLES_PERMISSION.UPDATE}>
              <EditIconComponent
                onClick={() =>
                  history.push({ pathname: `/permissions/edit/${record.id}`, state: record })
                }
              />
            </CheckPermission>

            <CheckPermission permissionCode={ROLES_PERMISSION.DELETE}>
              <DeleteIconComponent
                onClick={() =>
                  DeleteConfirm({
                    title: formatMessage('permissions.delete.title'),
                    content: formatMessage('permissions.delete.content'),
                    handleOk: () => {
                      removeRole.execute(record.id).then(() => {
                        handleRefresh();
                      });
                    },
                  })
                }
              />
            </CheckPermission>
          </Space>
        ),
      },
    ];
  }, []);
  const arrayAction: IArrayAction[] = [
    {
      iconType: 'add',
      permissionCode: ROLES_PERMISSION.CREATE,
      handleAction: () => {
        history.push(routerFormPermissions.path);
      },
    },
  ];
  const handleRefresh = () => {
    table.fetchData({
      pagination: queryParams,
    });
  };

  const handleSearch = search => {
    table.fetchData({
      pagination: { current: 1 },
      option: { search: search },
    });
  };

  return (
    <div className="permissions">
      <MainTitleComponent breadcrumbs={routerPermissions} />
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
          translateFirstKey="permissions"
          apiServices={rolePresenter.getListRole}
          register={table}
          columns={columns}
          hasStt={true}
          onChange={(pagination, options, sorter, extra) => {
            history.replace({
              pathname: location.pathname,
              search: toSearch({
                current: pagination.current,
              }),
            });
          }}
        />
      </div>
      <RightMenu arrayAction={arrayAction} />
    </div>
  );
};

export default Permissions;
