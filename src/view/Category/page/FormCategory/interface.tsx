import { ReactNode } from 'react';

import ProductEntity from '@modules/product/entity';

export interface IModal {
  isVisible: boolean;
  dataEdit: any;
  isReadOnly?: boolean;
}

export interface IPropsModal {
  handleFinish: (data: (ProductEntity | undefined)[]) => void;
  modal: IModal;
  setModal: (arg: any) => void;
  dataChoice: any;
}
export interface IFormContent {
  label?: string;
  name: string;
  render?: ReactNode;
  rules?: any;
}
