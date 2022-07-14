import { PaginationEntity } from '@core/pagination/entity';
import httpRepository from '@core/repository/http';
import { OptionEntity, TableEntity } from '@core/table';

import CustomerEntity from './entity';

// API GET 
export const getListCustomer = async (pagination: PaginationEntity, options: OptionEntity) => {
  const params = new TableEntity(pagination, options);
  return await httpRepository.execute({
    path: '/api/Customers',
    showSuccess: false,
    showError: false,
    params,
    convert: (res) => {
      return {
        data: CustomerEntity.createListCustomer(res?.pagedData),
        info: new PaginationEntity(res?.pageInfo)
      };
    }
  });
};

//and get detail
export const getDetailCustomer = async (id: string) => {
  return await httpRepository.execute({
    path: `/api/Customers/${id}`,
    showSuccess: false,
    showError: false,
    convert: (res) => {
      return new CustomerEntity(res);
    }
  });
};


//API ADD
export const createCustomer = async (payload: any) => {
  return await httpRepository.execute({
    path: '/api/Customers',
    method: "post",
    payload
  })
}


//API EDIT/UPDATE
export const updateCustomer = async (id: string, payload: any) => {
  return await httpRepository.execute({
    path: `/api/Customers/${id}`,
    method: "put",
    payload
  })
}

//API DELETE
export const deleteCustomer = async (id: string) => {
  return await httpRepository.execute({
    path: `/api/Customers/${id}`,
    method: "delete",
  });
};

//API DELETE
export const deleteManyCustomer = async (id: string) => {
  return await httpRepository.execute({
    path: `/api/Customers/${id}`,
    method: "delete",
  });
};