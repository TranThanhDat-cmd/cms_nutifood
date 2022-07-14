import RoleEntity from './entity';
import roleRepository from './repository';

const rolePresenter = { ...roleRepository };

rolePresenter.getPermissionsByType = async (permissionLevel: 0 | 1) => {
  const listPermissions = await roleRepository.getPermissionsByType(permissionLevel);
  //store.dispatch( RoleStore.actions.fetchListPermission( ( { data: listPermissions } ) ) );
  return listPermissions;
};

rolePresenter.addRole = async payload => {
  const response: RoleEntity = await roleRepository.addRole(payload);

  // store.dispatch( RoleStore.actions.updateList( ( { data: { ...response, permissions: payload.permissionIds }, role: "add" } ) ) );

  return response;
};
rolePresenter.updateRole = async (payload, idRole) => {
  const response = await roleRepository.updateRole(payload, idRole);
  //store.dispatch( RoleStore.actions.updateList( ( { data: { ...response, permissions: payload.permissionIds }, role: "update" } ) ) );

  return response;
};

rolePresenter.getRoleInGroup = async payload => {
  const response = await roleRepository.getRoleInGroup(payload);
  return response;
};

export default rolePresenter;
