import { ReactNode } from 'react';

export interface ITableModal {
  isVisible: boolean;
  dataEdit: any;
  isReadOnly?: boolean;
  isCreateNew?: boolean;
}

export interface IPropsModal {
  // handleRefresh: () => void;
  modal: ITableModal;
  setModal: (arg: any) => void;
  form: any;
  onFinish: any;
}
export interface IFormContent {
  label?: string;
  name: string;
  render?: ReactNode;
  rules?: any;
}

export interface EditableRowProps {
  index: number;
}
