import { Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { Key, useEffect, useState } from 'react';
import { router } from '{';

import RightMenu, { IArrayAction } from '@layout/RightMenu';
import CircleLabel from '@shared/components/CircleLabel';
import { DeleteConfirm } from '@shared/components/ConfirmDelete';
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
import { useAltaIntl } from '@shared/hook/useTranslate';

import ModalComponents from './component/MainModal/Modal{{pascalCase name}}';
import { IModal } from './interface';

const dataTable = require("./data.json");


const {{ pascalCase name }} = () => {
  const { formatMessage } = useAltaIntl();
  const table = useTable();

  const [modal, setModal] = useState<IModal>({
    isVisible: false,
    dataEdit: null,
    isReadOnly: false
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilterOption] = useState<{}>();

  const idChooses = "id"; //get your id here. Ex: accountId, userId,...
  const columns: ColumnsType = [
    {
      dataIndex: "tagName",
    },
    {
      dataIndex: "lastUpdate",
    },
    {
      dataIndex: "group",
    },
    {
      dataIndex: "group",
      render: () => <CircleLabel text={formatMessage("common.statusActive")} colorCode="blue"/>
    },
    {
      dataIndex: "action",
      render: (item, record: any, index) => (
        <Space>
          <EditIconComponent
            onClick={() => {
              setModal({
                dataEdit: record,
                isVisible: true,
                isReadOnly: false
              });
            }}
          />
          <InformationIconComponent
            onClick={() => {
              setModal({
                dataEdit: record,
                isVisible: true,
                isReadOnly: true
              });
            }}
          />
        </Space>
      ),
    },
  ];
 
  const arrayAction: IArrayAction[] = [
    {
      iconType: "add", handleAction: () => {
        setModal({ dataEdit: null, isVisible: true })
      }
    },
    { iconType: "share" },
    {
      iconType: "delete",
      disable: selectedRowKeys?.length==0,
      handleAction: () => {
        DeleteConfirm({
          content: formatMessage("common.delete"),
          handleOk: () => {
            // call Api Delete here
            handleRefresh()
          },
          handleCancel: () => { },
        });
      },
    },
  ];
  const dataString: ISelectData[] = [{ name: formatMessage("common.all"), value: null }]
  const arraySelectFilter: ISelectAndLabel[] = [
    { textLabel: "Lĩnh vực", dataString },
    { textLabel: "Địa bàn quản lý", dataString },
    { textLabel: "Trạng thái", dataString },
  ]

  useEffect(() => {
    table.fetchData({ option: { search: search, filter: { ...filter } } });
  }, [search, filter]);

  const handleRefresh = () => {
    table.fetchData({ option: { search: search, filter: { ...filter } } });
    setSelectedRowKeys([]);
  };

  const handleSearch = (searchKey: string) => {
    setSearch(searchKey);
  };

  const onChangeSelectStatus = (name) => (status) => {
    setFilterOption((pre) => ({ ...pre, [name]: status }));
  };
  return (
    <div className='{{kebabCase name}}'>
      <MainTitleComponent breadcrumbs={router{{pascalCase name}} } />
      <div className="main-card">
      <div className="d-flex flex-row justify-content-md-between mb-3 align-items-end">
          <div className="d-flex flex-row ">
            {arraySelectFilter.map((item, index) => (
              <SelectAndLabelComponent
                onChange={onChangeSelectStatus(item.name)}
                key={item.name}
                className="margin-select"
                dataString={item.dataString}
                textLabel={item.textLabel}
              />
            ))}
          </div>
          <div className="d-flex flex-column ">
            <div className="label-select">
              {formatMessage("common.keyword")}
            </div>
            <SearchComponent
              onSearch={handleSearch}
              placeholder={"common.keyword"}
              classNames="mb-0"
            />
          </div>
        </div>
        <TableComponent
          // apiServices={}
          defaultOption={filter }
          translateFirstKey='{{camelCase name}}'
          rowKey={(res) => res[idChooses]}
          register={table}
          columns={columns}
          onRowSelect={setSelectedRowKeys}
          dataSource={dataTable}
          disableFirstCallApi={true}
        />
      </div>
      <RightMenu arrayAction={arrayAction} />
      <ModalComponents
        modal={modal}
        handleRefresh={handleRefresh}
        setModal={setModal}
      />
    </div>
  );
};

export default {{ pascalCase name }};

