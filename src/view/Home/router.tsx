import { IRouter } from '@routers/interface';

export const routerHome: IRouter = {
  path: '/',
  loader: import('./index'),
  exact: true,
  name: 'home.name', //translate here for breadcrumb and sidebar
};
