import lodash from 'lodash';
import { useSelector } from 'react-redux';

import { RootState } from '@modules';

interface IProps {
  permissionCode: string;
  children;
}

export const CheckPermissionFunc = lodash.memoize(
  (permissionCode, listPermissionCode) => {
    if (listPermissionCode == null) {
      return false;
    }
    if (typeof listPermissionCode == 'string' && listPermissionCode.includes(permissionCode)) {
      return true;
    } else if (Array.isArray(listPermissionCode)) {
      return listPermissionCode.some(pp => pp == permissionCode);
    }
    return false;
  },
  (permissionCode, listPermissionCode) => {
    if (listPermissionCode == null || listPermissionCode == '') {
      return '';
    }
    if (typeof listPermissionCode == 'string') {
      return permissionCode + ':' + listPermissionCode;
    }
    return permissionCode + ':' + listPermissionCode.join(',');
  }
);

export const useCheckPermission = (...permissionCodes) => {
  const { listPermissionCode } = useSelector((state: RootState) => state.profile);
  return permissionCodes.map(permissionCode =>
    CheckPermissionFunc(permissionCode, listPermissionCode)
  );
};

const CheckPermission = (props: IProps) => {
  const { permissionCode, children } = props;
  if (children == null) {
    return null;
  }
  const { listPermissionCode } = useSelector((state: RootState) => state.profile);
  if (CheckPermissionFunc(permissionCode, listPermissionCode)) {
    return children;
  }
  return null;
};

export default CheckPermission;
