import { PaginationEntity } from '@core/pagination/entity';
import httpRepository from '@core/repository/http';
import { OptionEntity, TableEntity } from '@core/table';
import ProductEntity from '@modules/product/entity';

import ShelfEntity from './entity';

// API GET
export const getListShelf = async (pagination: PaginationEntity, options: OptionEntity) => {
  const params = new TableEntity(pagination, options);
  return await httpRepository.execute({
    path: '/api/Shelfs',
    showSuccess: false,
    showError: false,
    params,
    convert: res => {
      return {
        data: ShelfEntity.createListShelf(res?.pagedData),
        info: new PaginationEntity(res?.pageInfo),
      };
    },
  });
};

// API GET
export const getAllShelfProduct = async () => {
  return await httpRepository.execute({
    path: 'api/Shelfs/ShelfProducts',
    showSuccess: false,
    showError: false,
    convert: res => {
      return {
        data: res,
      };
    },
  });
};

//and get detail
export const getDetailShelf = async id => {
  return await httpRepository.execute({
    path: '/api/Shelfs/' + id,
    showSuccess: false,
    showError: false,
    convert: res => {
      return new ShelfEntity(res);
    },
  });
};

//API ADD
export const createShelf = async payload => {
  console.debug(payload);
  return await httpRepository.execute({
    path: '/api/Shelfs',
    method: 'post',
    payload,
    config: { isPrivate: true, isFormData: true },
  });
};

//API EDIT/UPDATE
export const updateShelf = async (id, payload) => {
  return await httpRepository.execute({
    path: '/api/Shelfs/' + id,
    method: 'put',
    payload,
    config: { isPrivate: true, isFormData: true },
  });
};

//API DELETE
export const deleteShelf = async id => {
  return await httpRepository.execute({
    path: '/api/Shelfs/' + id,
    method: 'delete',
  });
};

// API GET LIST PRODUCT IN EACH SHELF
export const getShelfProduct = async id => {
  return await httpRepository.execute({
    path: '/api/Shelfs/' + id + '/Products',
    showSuccess: false,
    showError: true,
    convert: res => {
      console.debug(res);
      return {
        data: ProductEntity.createListProduct(res),
      };
    },
  });
};

export const createShelfProduct = async (payload, id) => {
  return await httpRepository.execute({
    path: '/api/Shelfs' + id + '/Products',
    showError: true,
    showSuccess: true,
    payload,
    config: { isFormData: true },
  });
};

export const updateShelfProduct = async (payload, id) => {
  return await httpRepository.execute({
    path: 'api/Shelfs' + id + '/Products',
    showError: true,
    showSuccess: false,
    payload,
    config: { isFormData: true },
  });
};

export const deleteShelfProduct = async id => {
  return await httpRepository.execute({
    path: 'api/Shelfs' + id + '/Products',
    showError: true,
    showSuccess: false,
  });
};
