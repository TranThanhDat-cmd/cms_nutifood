import { RootState } from '@modules';
import { ReactNode } from 'react';
import { Selector } from '@reduxjs/toolkit';
export type IRouter = {
  loader?: Promise<object>;
  path: string;
  permissionCode?: string | 'ALLOW';
  component?: React.FC<any>;
  isPrivate?: boolean;
  exact?: boolean;
  name?: string;
  masterLayout?: boolean;
  menu?: {
    icon?: ReactNode;
    hideInNavbar?: boolean;
    exact?: boolean;
    activePath?: string[];
    generatePath?: (params: any) => string;
    selector?: Selector<RootState, any>;
  };
  routes?: Array<IRouter>;
};
