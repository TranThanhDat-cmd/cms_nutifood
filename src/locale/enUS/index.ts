import enUS from 'antd/lib/locale/en_US';

import account from './account';
import auth from './auth';
import banner from './banner';
import category from './category';
import common from './common';
import customer from './customer';
import pageError from './pageError';
import product from './product';
import profile from './profile';
import question from './question';
import roles from './roles';
import server from './server';
import shelf from './shelf';
import stores from './stores';
import user from './user';

export default {
  ...enUS,
  ...common,
  ...server,
  ...auth,
  ...account,
  ...category,
  ...roles,
  ...product,
  ...stores,
  ...customer,
  ...pageError,
  ...user,
  ...question,
  ...shelf,
  ...profile,
  ...banner,
};
