import moment from 'moment';

import UserEntity from '@modules/user/entity';

class RoleEntity {
  id: string = '';
  name: string = '';
  organizationId: string = '';
  roleType: number = 0;
  roleStatus: number = 0;
  roleDescription: string = '';
  createdAt: string = '';
  rolePermissions: rolePermissions[] = [];
  users: UserEntity[] = [];
  constructor(role?) {
    if (!role) return;
    Object.assign(this, role);
    this.createdAt = role?.createdAt ? moment(role?.createdAt).format('DD/MM/YYYY HH:mm:ss') : '';
  }

  static createListRole(listRole) {
    if (!Array.isArray(listRole)) return [];
    return listRole.map(Role => {
      return new RoleEntity(Role);
    });
  }
}

export default RoleEntity;

interface rolePermissions {
  rolePermissionId: string;
  roleId: string;
  code: string;
  permission: { code: string; name: string };
  roleCreatedAt: string;
}
