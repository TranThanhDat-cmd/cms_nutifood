import { PaginationEntity } from '@core/pagination/entity';
import httpRepository from '@core/repository/http';
import { OptionEntity, TableEntity } from '@core/table';

import { ModulePermissionEntity } from './entity';

// API GET
export const getListPermissionsByGroup = async (
  pagination: PaginationEntity,
  options: OptionEntity
) => {
  const params = new TableEntity(pagination, options);
  return await httpRepository.execute({
    path: '/api/Permissions/GroupByName',
    showSuccess: false,
    showError: false,
    params,
    convert: res => {
      return {
        data: ModulePermissionEntity.createListPermissions(res?.pagedData),
        info: new PaginationEntity(res?.pageInfo),
      };
    },
  });
};
export const getListPermissions = async (pagination: PaginationEntity, options: OptionEntity) => {
  const params = new TableEntity(pagination, options);
  return await httpRepository.execute({
    path: '/api/Permissions',
    showSuccess: false,
    showError: false,
    params,
    convert: res => {
      return {
        data: ModulePermissionEntity.createListPermissions(res?.pagedData),
        info: new PaginationEntity(res?.pageInfo),
      };
    },
  });
};
//and get detail
export const getDetailPermissions = async id => {
  return await httpRepository.execute({
    path: '/api/permissions/' + id,
    showSuccess: false,
    showError: false,
    convert: res => {
      return new ModulePermissionEntity(res);
    },
  });
};

//API ADD
export const createPermissions = async payload => {
  return await httpRepository.execute({
    path: '/api/permissions',
    method: 'post',
    payload,
  });
};

//API EDIT/UPDATE
export const updatePermissions = async (id, payload) => {
  return await httpRepository.execute({
    path: '/api/permissions/' + id,
    method: 'put',
    payload,
  });
};

//API DELETE
export const deletePermissions = async id => {
  return await httpRepository.execute({
    path: '/api/permissions/' + id,
    method: 'delete',
  });
};
