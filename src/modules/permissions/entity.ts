import moment from 'moment';

export class PermissionEntity {
  code: string = '';
  name: string = '';

  constructor(permision?) {
    Object.assign(this, permision);
  }
}
export class ModulePermissionEntity {
  name: string = '';
  rolePermissions: PermissionEntity[] = [];
  constructor(modulePermission?) {
    if (modulePermission == null) {
      return;
    }
    this.name = modulePermission.group;
    this.rolePermissions = modulePermission.permissions?.map(per => new PermissionEntity(per));
  }
  static createListPermissions(listPermissions: Array<any>) {
    if (!Array.isArray(listPermissions)) return [];
    return listPermissions.map((permissions: ModulePermissionEntity) => {
      return new ModulePermissionEntity(permissions);
    });
  }
}
