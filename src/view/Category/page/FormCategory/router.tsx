import { IRouter } from '@routers/interface';

export const routerFormCategory: IRouter = {
  path: '/category/:status/:id',
  loader: import('./index'),
  exact: true,
  name: 'formCategory.name', //translate here for breadcrumb and sidebar
};

export const routerFormUpdateCategory: IRouter = {
  path: '/category/update/:id',
  loader: import('./index'),
  exact: true,
  name: 'formUpdateCategory.name', //translate here for breadcrumb and sidebar
};

export const routerFormInfoCategory: IRouter = {
  path: '/category/info/:id',
  loader: import('./index'),
  exact: true,
  name: 'formInfoCategory.name', //translate here for breadcrumb and sidebar
};

export const routerFormAddCategory: IRouter = {
  path: '/category/add',
  loader: import('./index'),
  exact: true,
  name: 'formAddCategory.name', //translate here for breadcrumb and sidebar
};
