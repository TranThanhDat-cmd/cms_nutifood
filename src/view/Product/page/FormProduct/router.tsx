import { IRouter } from '@routers/interface';

export const routerFormAddProduct: IRouter = {
  path: '/form-product/add',
  loader: import('./index'),
  exact: true,
  name: 'formAddProduct.name', //translate here for breadcrumb and sidebar
};

export const routerFormUpdateProduct: IRouter = {
  path: '/form-product/:id',
  loader: import('./index'),
  exact: true,
  name: 'formUpdateProduct.name', //translate here for breadcrumb and sidebar
};

export const routerFormInfoProduct: IRouter = {
  path: '/form-product/:id/info',
  loader: import('./index'),
  exact: true,
  name: 'formInfoProduct.name', //translate here for breadcrumb and sidebar
};
