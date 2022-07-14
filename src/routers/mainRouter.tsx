import { routerForgotPassword } from '@view/Auth/ForgotPassword/router';
import { routerLogin } from '@view/Auth/Login/router';
import { routerLoginByOTP } from '@view/Auth/LoginByOTP/router';
import { routerRegister } from '@view/Auth/Register/router';
import { routerResetPassword } from '@view/Auth/ResetPassword/router';
import { routerMainPublicPage } from '@view/Auth/router';
import { routerBanner } from '@view/Banner/router';
import {
  routerFormAddCategory,
  routerFormCategory,
  routerFormInfoCategory,
  routerFormUpdateCategory,
} from '@view/Category/page/FormCategory/router';
import { routerCategory } from '@view/Category/router';
import { routerCustomer } from '@view/Customer/router';
import { routerHome } from '@view/Home/router';
import { routerPageError } from '@view/PageError/router';
import {
  routerFormPermissions,
  routerFormPermissionsEdit,
} from '@view/Permissions/page/FormPermissions/router';
import { routerPermissions } from '@view/Permissions/router';
import {
  routerFormAddProduct,
  routerFormInfoProduct,
  routerFormUpdateProduct,
} from '@view/Product/page/FormProduct/router';
import { routerProduct } from '@view/Product/router';
import { routerViewProfile } from '@view/Profile/router';
import { routerQuestion } from '@view/Question/router';
import {
  routerFormAddShelf,
  routerFormInfoShelf,
  routerFormShelf,
  routerFormUpdateShelf,
} from '@view/Shelf/page/FormShelf/router';
import { routerShelf } from '@view/Shelf/router';
import { routerUser } from '@view/User/router';

import { IRouter } from './interface';

export const privatePage: IRouter[] = [
  routerHome,
  routerProduct,
  routerUser,
  routerCustomer,
  routerQuestion,
  routerShelf,
  routerFormShelf,
  routerFormAddShelf,
  routerFormInfoShelf,
  routerFormUpdateShelf,
  routerViewProfile,
  routerPermissions,
  routerFormAddProduct,
  routerFormUpdateProduct,
  routerFormInfoProduct,
  routerCategory,
  routerFormPermissions,
  routerFormPermissionsEdit,
  routerFormUpdateCategory,
  routerFormCategory,
  routerFormInfoCategory,
  routerFormAddCategory,
  routerBanner,
  routerPageError,
];

export const publicPage: IRouter[] = [
  routerMainPublicPage,
  routerLogin,
  routerRegister,
  routerForgotPassword,
  routerResetPassword,
  routerLoginByOTP,
  routerPageError,
];
