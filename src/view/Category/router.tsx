import { BookOutlined } from '@ant-design/icons';
import { PRODUCT_CATEGORIES_PERMISSION } from '@modules/product/contants';
import { IRouter } from '@routers/interface';

export const routerCategory: IRouter = {
  path: '/category',
  loader: import('./index'),
  exact: true,
  name: 'category.name', //translate here for breadcrumb and sidebar
  menu: {
    icon: <BookOutlined />,
    activePath: ['/category'],
  },
  permissionCode: PRODUCT_CATEGORIES_PERMISSION.VIEW,
};
