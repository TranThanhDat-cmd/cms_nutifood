import { IRouter } from '@routers/interface';

export interface IBreadcrumbs {
  className?: any;
  breadcrumbs: IRouter[] | IRouter;
}
export interface ITitle {
  title: string | React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}
