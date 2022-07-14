import { PaginationEntity } from '@core/pagination/entity';
import httpRepository from '@core/repository/http';
import { OptionEntity, TableEntity } from '@core/table';
import UserEntity, { PermissionEntity } from '@modules/user/entity';

const addUser = async payload => {
  return await httpRepository.execute({
    path: `/api/Users/SignUp`,
    method: 'post',
    payload,
    config: { isPrivate: true, isFormData: true },
  });
};

const updateUser = async (payload, id) => {
  return await httpRepository.execute({
    path: `/api/Users/${id}`,
    method: 'put',
    payload,
    config: { isPrivate: true, isFormData: true },
  });
};

const deleteUser = async id => {
  return await httpRepository.execute({
    path: `/api/Users/${id}`,
    method: 'delete',
    config: { isPrivate: true },
  });
};

const getUser = async (pagination: PaginationEntity, options: OptionEntity) => {
  const params = new TableEntity(pagination, options);
  return await httpRepository.execute({
    path: `api/Users`,
    showError: false,
    showSuccess: false,
    params,
    convert: res => {
      return {
        data: UserEntity.createArrayUser(res.pagedData),
        info: new PaginationEntity(res?.pageInfo),
      };
    },
  });
};

const getDetailUser = async params => {
  return await httpRepository.execute({
    path: `/api/Accounts/${params}`,
    showError: false,
    showSuccess: false,
    convert: res => new UserEntity(res),
  });
};

const getPermission = async () => {
  return httpRepository.execute({
    path: '/api/Permissions',
    showSuccess: false,
    convert: res => PermissionEntity.createListPermission(res),
  });
};

export default {
  getDetailUser,
  addUser,
  updateUser,
  deleteUser,
  getPermission,
  getUser,
};
