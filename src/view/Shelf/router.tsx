import { GiBookshelf } from 'react-icons/gi';

import { SHELFS_PERMISSION } from '@modules/shelf/contants';
import { IRouter } from '@routers/interface';

export const routerShelf: IRouter = {
  path: '/shelf',
  loader: import('./index'),
  exact: true,
  menu: {
    icon: <GiBookshelf />,
    activePath: ['/shelf'],
  },
  name: 'shelf.name', //translate here for breadcrumb and sidebar
  permissionCode: SHELFS_PERMISSION.VIEW,
};
