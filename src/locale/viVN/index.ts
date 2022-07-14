import viVN from 'antd/lib/locale/vi_VN';

import accounts from './accounts';
import auth from './auth';
import banner from './banner';
import category from './category';
import common from './common';
import customer from './customer';
import Form from './form';
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
  ...viVN,
  ...common,
  ...server,
  ...auth,
  ...pageError,
  ...accounts,
  ...roles,
  ...product,
  ...question,
  ...stores,
  ...customer,
  ...user,
  ...shelf,
  ...profile,
  ...category,
  ...banner,
  Form,
};
