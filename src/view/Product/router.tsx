import BagIcon from '@assets/icon/bag';
import { PRODUCTS_PERMISSION } from '@modules/product/contants';
import { IRouter } from '@routers/interface';

export const routerProduct: IRouter = {
  path: '/product',
  loader: import('./index'),
  exact: true,
  menu: {
    icon: <BagIcon />,
    activePath: ['/product', '/form-product/:id', '/form-product', '/form-product/:id/info'],
  },
  name: 'product.name.breadcrumb', //translate here for breadcrumb and sidebar
  permissionCode: PRODUCTS_PERMISSION.VIEW,
};
