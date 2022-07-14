import { IRouter } from '@routers/interface';

export const routerLoginByOTP: IRouter = {
  path: '/login-otp',
  loader: import('./index'),
  exact: true,
};
