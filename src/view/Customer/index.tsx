import { Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';

import CheckPermission from '@hoc/CheckPermission';
import { CUSTOMER_PERMISSION } from '@modules/customer/contants';
import customerPresenter from '@modules/customer/presenter';
import BadgeBoolean from '@shared/components/BadgeBoolean';
import { DeleteConfirm } from '@shared/components/ConfirmDelete';
import DeleteIconComponent from '@shared/components/DeleteIcon';
import EditIconComponent from '@shared/components/EditIconComponent';
import InformationIconComponent from '@shared/components/InformationIcon';
import MainTitleComponent from '@shared/components/MainTitleComponent';
import SearchComponent from '@shared/components/SearchComponent/SearchComponent';
import SelectAndLabelComponent, {
  ISelectAndLabel,
  ISelectData
} from '@shared/components/SelectAndLabelConponent';
import TableComponent from '@shared/components/TableComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useSingleAsync } from '@shared/hook/useAsync';
import { useAltaIntl } from '@shared/hook/useTranslate';

import ModalComponents from './component/MainModal/ModalCustomer';
import { IModal } from './interface';
import { routerCustomer } from './router';

const Customer = () => {
  const { formatMessage } = useAltaIntl();
  const table = useTable();
  const [modal, setModal] = useState<IModal>({
    isVisible: false,
    dataEdit: null,
    isReadOnly: false,
  });
  const [search, setSearch] = useState<string>('');
  const [filter, setFilterOption] = useState<{}>();
  const deleteCustomer = useSingleAsync(customerPresenter.deleteCustomer);

  const columns: ColumnsType = [
    {
      dataIndex: 'fullName',
      sorter: true,
    },
    {
      dataIndex: 'phoneNumber',
    },
    {
      dataIndex: 'createdAt',
      sorter: true,
    },
    {
      dataIndex: 'active',
      sorter: true,
      render: text => <BadgeBoolean status={text} id="customer.status.param" />,
    },
    {
      dataIndex: 'action',
      render: (item, record: any) => (
        <Space>
          <CheckPermission permissionCode={CUSTOMER_PERMISSION.UPDATE}>
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
          <CheckPermission permissionCode={CUSTOMER_PERMISSION.VIEW}>
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

          <CheckPermission permissionCode={CUSTOMER_PERMISSION.DELETE}>
            <DeleteIconComponent
              onClick={() => {
                DeleteConfirm({
                  title: formatMessage('customer.confirm.title.delete'),
                  content: formatMessage('customer.confirm.content.delete'),
                  handleOk: () => {
                    deleteCustomer?.execute([record.id]).then(() => handleRefresh());
                  },
                });
              }}
            />
          </CheckPermission>
        </Space>
      ),
    },
  ];

  const dataString: ISelectData[] = [
    { name: 'common.all', value: null },
    { name: 'customer.true', value: true },
    { name: 'customer.false', value: false },
  ];

  const arraySelectFilter: ISelectAndLabel[] = [{ textLabel: 'customer.active', dataString }];

  useEffect(() => {
    table.fetchData({ option: { search: search, filter: { ...filter } } });
  }, [search, filter]);

  const handleRefresh = () => {
    table.fetchData({ option: { search: search, filter: { ...filter } } });
  };

  const handleSearch = (searchKey: string) => {
    setSearch(searchKey);
  };

  const onChangeSelectStatus = name => status => {
    setFilterOption(pre => ({ ...pre, [name]: status }));
  };

  return (
    <div className="customer">
      <MainTitleComponent breadcrumbs={routerCustomer} />
      <div className="main-card">
        <div className="d-flex flex-row justify-content-md-between mb-3 align-items-end">
          <div className="d-flex flex-row ">
            {arraySelectFilter.map((item, index) => (
              <SelectAndLabelComponent
                onChange={onChangeSelectStatus('Active')}
                key={item.name}
                className="margin-select"
                dataString={item.dataString}
                textLabel={item.textLabel}
              />
            ))}
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
          apiServices={customerPresenter.getListCustomer}
          hasStt={true}
          defaultOption={filter}
          translateFirstKey="customer"
          rowKey={res => res.id}
          register={table}
          columns={columns}
          disableFirstCallApi={true}
        />
      </div>
      <ModalComponents modal={modal} handleRefresh={handleRefresh} setModal={setModal} />
    </div>
  );
};

export default Customer;
