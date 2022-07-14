import { IRouter } from '@routers/interface';

import FormPermissions from './index';

export const routerFormPermissions: IRouter = {
  path: '/permissions/add',
  loader: import('./index'),
  exact: true,
  name: 'common.add', //translate here for breadcrumb and sidebar
};

export const routerFormPermissionsEdit: IRouter = {
  path: '/permissions/edit/:id',
  loader: import('./index'),
  exact: true,
  name: 'common.update',
  component: FormPermissions, //translate here for breadcrumb and sidebar
};
