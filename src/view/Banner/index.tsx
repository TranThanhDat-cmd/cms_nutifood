import './style.scss';

import { Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';

import CheckPermission from '@hoc/CheckPermission';
import RightMenu, { IArrayAction } from '@layout/RightMenu';
import { BANNER_PERMISSION } from '@modules/banner/contants';
import bannerPresenter from '@modules/banner/presenter';
import AddIconComponent from '@shared/components/AddComponent';
import { DeleteConfirm } from '@shared/components/ConfirmDelete';
import DeleteIconComponent from '@shared/components/DeleteIcon';
import EditIconComponent from '@shared/components/EditIconComponent';
import InformationIconComponent from '@shared/components/InformationIcon';
import MainTitleComponent from '@shared/components/MainTitleComponent';
import SearchComponent from '@shared/components/SearchComponent/SearchComponent';
import TableComponent from '@shared/components/TableComponent';
import useTable from '@shared/components/TableComponent/hook';
import { useAltaIntl } from '@shared/hook/useTranslate';

import BadgeBanner from './component/Badge';
import ModalAddMedia from './component/MainModal/ModalAddFile';
import ModalComponents from './component/MainModal/ModalBanner';
import { IModal } from './interface';
import { routerBanner } from './router';

const Banner = () => {
  const { formatMessage } = useAltaIntl();
  const table = useTable();

  const [modal, setModal] = useState<IModal>({
    isVisible: false,
    dataEdit: null,
    isReadOnly: false,
  });

  // const [modalAdd, setModalAdd] = useState<IModal>({
  //   isVisible: false,
  //   dataEdit: null,
  //   isReadOnly: false,
  // });

  const [search, setSearch] = useState<string>('');
  const [filter, setFilterOption] = useState<{}>();

  const idChooses = 'id'; //get your id here. Ex: accountId, userId,...
  const columns: ColumnsType = [
    {
      dataIndex: 'name',
      sorter: true,
    },
    {
      dataIndex: 'position',
      title: 'banner.name.position',
      render: text => {
        return <BadgeBanner status={text} />;
      },
      sorter: true,
    },
    {
      dataIndex: 'position',
      sorter: true,
    },
    {
      dataIndex: 'createdAt',
      sorter: true,
    },
    {
      dataIndex: 'action',
      render: (item, record: any) => (
        <Space>
          <CheckPermission permissionCode={BANNER_PERMISSION.UPDATE}>
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
          <CheckPermission permissionCode={BANNER_PERMISSION.VIEW}>
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
          <CheckPermission permissionCode={BANNER_PERMISSION.DELETE}>
            <DeleteIconComponent
              onClick={() => {
                DeleteConfirm({
                  title: formatMessage('banner.confirm.title.delete'),
                  content: formatMessage('banner.confirm.content.delete'),
                  handleOk: () => {
                    bannerPresenter.deleteBanner(record.id).then(() => {
                      handleRefresh();
                    });
                  },
                });
              }}
            />
          </CheckPermission>
          {/* <CheckPermission permissionCode={BANNER_PERMISSION.UPDATE}>
            <AddIconComponent
              onClick={() => {
                setModalAdd({
                  dataEdit: record,
                  isVisible: true,
                  isReadOnly: false,
                });
              }}
            />
          </CheckPermission> */}
        </Space>
      ),
    },
  ];

  const arrayAction: IArrayAction[] = [
    {
      iconType: 'add',
      permissionCode: BANNER_PERMISSION.CREATE,
      handleAction: () => {
        setModal({ dataEdit: null, isVisible: true });
      },
    },
  ];

  useEffect(() => {
    table.fetchData({ option: { search: search, filter: { ...filter } } });
  }, [search, filter]);

  const handleRefresh = () => {
    table.fetchData({ option: { search: search, filter: { ...filter } } });
  };

  const handleSearch = (searchKey: string) => {
    setSearch(searchKey);
  };

  return (
    <div className="banner">
      <MainTitleComponent breadcrumbs={routerBanner} />
      <div className="main-card">
        <div className="d-flex flex-row justify-content-md-between mb-3 align-items-end">
          <div className="d-flex flex-row "></div>
          <div className="d-flex flex-column ">
            <div className="label-select">{formatMessage('common.keyword')}</div>
            <SearchComponent
              onSearch={handleSearch}
              placeholder={'banner.search.placeholder'}
              classNames="mb-0"
            />
          </div>
        </div>
        <TableComponent
          apiServices={bannerPresenter.getListBanner}
          defaultOption={filter}
          translateFirstKey="banner"
          rowKey={res => res[idChooses]}
          register={table}
          columns={columns}
          hasStt={true}
          disableFirstCallApi={true}
        />
      </div>
      <RightMenu arrayAction={arrayAction} />
      <ModalComponents modal={modal} handleRefresh={handleRefresh} setModal={setModal} />
      {/* <ModalAddMedia modalAdd={modalAdd} setModalAdd={setModalAdd} handleRefresh={handleRefresh} /> */}
    </div>
  );
};

export default Banner;
