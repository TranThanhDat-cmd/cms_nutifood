import { IconShield } from '@assets/icon/index copy';
import { ROLES_PERMISSION } from '@modules/permissions/constants';
import { IRouter } from '@routers/interface';

export const routerPermissions: IRouter = {
  path: '/permissions',
  loader: import('./index'),
  exact: true,
  name: 'roles.name.tittle',
  menu: {
    icon: <IconShield />,
    activePath: ['/permissions', '/permissions/add', '/permissions/edit'],
  },
  permissionCode: ROLES_PERMISSION.VIEW,
};
