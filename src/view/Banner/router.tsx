import { FileImageOutlined } from '@ant-design/icons';
import { BANNER_PERMISSION } from '@modules/banner/contants';
import { IRouter } from '@routers/interface';

export const routerBanner: IRouter = {
  path: '/banner',
  loader: import('./index'),
  exact: true,
  name: 'banner.manager.name', //translate here for breadcrumb and sidebar
  menu: {
    icon: <FileImageOutlined />,
  },
  permissionCode: BANNER_PERMISSION.VIEW,
};
