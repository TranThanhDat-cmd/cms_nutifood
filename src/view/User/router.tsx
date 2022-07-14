import { UserOutlined } from '@ant-design/icons';
import { USERS_PERMISSION } from '@modules/user/contants';
import { IRouter } from '@routers/interface';

export const routerUser: IRouter = {
  path: '/user',
  loader: import('./index'),
  exact: true,
  name: 'user.name',
  menu: {
    icon: <UserOutlined />,
    activePath: ['/user'],
  },
  permissionCode: USERS_PERMISSION.VIEW,
};
