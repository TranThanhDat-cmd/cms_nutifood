import { TeamOutlined } from '@ant-design/icons';
import { CUSTOMER_PERMISSION } from '@modules/customer/contants';
import { IRouter } from '@routers/interface';

export const routerCustomer: IRouter = {
  path: '/customer',
  loader: import('./index'),
  exact: true,
  name: 'customer.name', //translate here for breadcrumb and sidebar
  menu: {
    icon: <TeamOutlined />,
  },
  permissionCode: CUSTOMER_PERMISSION.VIEW,
};
