import { IRouter } from '@routers/interface';

export const routerFormShelf: IRouter = {
  path: '/shelf/:status/:id',
  loader: import('./index'),
  exact: true,
  name: 'formShelf.name', //translate here for breadcrumb and sidebar
};

export const routerFormUpdateShelf: IRouter = {
  path: '/shelf/update/:id',
  loader: import('./index'),
  exact: true,
  name: 'formUpdateShelf.name', //translate here for breadcrumb and sidebar
};

export const routerFormInfoShelf: IRouter = {
  path: '/shelf/info/:id',
  loader: import('./index'),
  exact: true,
  name: 'formInfoShelf.name', //translate here for breadcrumb and sidebar
};

export const routerFormAddShelf: IRouter = {
  path: '/shelf/add',
  loader: import('./index'),
  exact: true,
  name: 'formAddShelf.name', //translate here for breadcrumb and sidebar
};
