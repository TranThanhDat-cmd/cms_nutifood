import { PaginationEntity } from '@core/pagination/entity';
import httpRepository from '@core/repository/http';
import { OptionEntity, TableEntity } from '@core/table';

import CategoryEntity from './entity';

// API GET
export const getListCategory = async (pagination: PaginationEntity, options: OptionEntity) => {
  const params = new TableEntity(pagination, options);
  return await httpRepository.execute({
    path: '/api/ProductCategories',
    showSuccess: false,
    showError: false,
    params,
    convert: res => {
      return {
        data: CategoryEntity.createListCategory(res?.pagedData),
        info: new PaginationEntity(res?.pageInfo),
      };
    },
  });
};

// API GET ALL
export const getListAllCategory = async () => {
  return await httpRepository.execute({
    path: '/api/ProductCategories',
    showSuccess: false,
    showError: false,
    convert: res => {
      return {
        data: CategoryEntity.createListCategory(res?.pagedData),
      };
    },
  });
};

//and get detail
export const getDetailCategory = async id => {
  return await httpRepository.execute({
    path: '/api/ProductCategories/' + id,
    showSuccess: false,
    showError: false,
    convert: res => {
      return new CategoryEntity(res);
    },
  });
};

//API ADD
export const createCategory = async payload => {
  return await httpRepository.execute({
    path: '/api/ProductCategories/',
    method: 'post',
    payload,
    config: { isPrivate: true, isFormData: true },
  });
};

//API EDIT/UPDATE
export const updateCategory = async (id, payload) => {
  return await httpRepository.execute({
    path: '/api/ProductCategories/' + id,
    method: 'put',
    payload,
    config: { isPrivate: true, isFormData: true },
  });
};

//API DELETE
export const deleteCategory = async id => {
  return await httpRepository.execute({
    path: '/api/ProductCategories/' + id,
    method: 'delete',
  });
};
