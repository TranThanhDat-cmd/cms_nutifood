import { PaginationEntity } from '@core/pagination/entity';
import httpRepository from '@core/repository/http';
import { OptionEntity, TableEntity } from '@core/table';

import ProductEntity from './entity';

// API GET 
export const getListProduct = async (pagination?: PaginationEntity, options?: OptionEntity) => {
  const params = new TableEntity(pagination, options);
  return await httpRepository.execute({
    path: '/api/Products',
    showSuccess: false,
    showError: false,
    params,
    convert: res => {
      return {
        data: ProductEntity.createListProduct(res?.pagedData),
        info: new PaginationEntity(res?.pageInfo),
      };
    },
  });
};
//and get detail
export const getDetailProduct = async id => {
  return await httpRepository.execute({
    path: '/api/Products/' + id,
    showSuccess: false,
    showError: false,
    convert: res => {
      return new ProductEntity(res);
    },
  });
};

//API ADD
export const createProduct = async payload => {
  return await httpRepository.execute({
    path: '/api/Products',
    method: 'post',
    payload,
    config: { isFormData: true },
  });
};

//API EDIT/UPDATE
export const updateProduct = async (id, payload) => {
  return await httpRepository.execute({
    path: '/api/Products/' + id,
    method: 'put',
    payload,
    config: { isFormData: true },
  });
};

//API DELETE
export const deleteProduct = async id => {
  return await httpRepository.execute({
    path: '/api/Products/' + id,
    method: 'delete',
  });
};

//API addLinkImgProduct
export const addLinkImgProduct = async (payload) => {
  return await httpRepository.execute({
    path: '/api/Medias',
    method: "post",
    payload,
    config: { isFormData: true }
  });
};

//API addLinkImgManyProduct
export const addLinkImgManyProduct = async (payload) => {
  return await httpRepository.execute({
    path: '/api/Medias/Many',
    method: "post",
    payload,
    config: { isFormData: true }
  });
};
