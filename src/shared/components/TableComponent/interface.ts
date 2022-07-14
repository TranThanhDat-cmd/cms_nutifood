import { TableProps } from 'antd';

import { PaginationEntity } from '@core/pagination/entity';
import { OptionEntity } from '@core/table';

import { IRef } from './hook';

export interface IBEPaginationTable extends TableProps<any> {
  apiServices?: Function;
  columns?: any[];
  defaultOption?: OptionEntity;
  register?: IRef;
  translateFirstKey?: string;
  getDataAfter?: (data) => void;
  disableFirstCallApi?: boolean;
  search?: {
    placeholder: string;
    align?: 'left' | 'right';
    className?: string;
  };
  hasStt?: boolean;
  onRowSelect?: (params: React.Key[]) => void;
  summaryKey?: string;
  onRowSelectDetail?: (params: React.Key[]) => void;
  selectedRowKeys?: React.Key[];
}

export const InitOption: OptionEntity = {
  search: '',
  // tới dự án nào dùng tới filter sorter rồi bỏ comment ra nha
  filter: {},
  // sorter: {
  //   sortField: "",
  //   sortOrder: "",
  // },
};

export const InitPagination: PaginationEntity = {
  pageSize: 10,
  total: 0,
  current: 1,
};
