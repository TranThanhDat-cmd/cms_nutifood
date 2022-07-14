import httpRepository from "@core/repository/http";
import {{pascalCase name}}Entity from "./entity";
import { PaginationEntity } from "@core/pagination/entity";
import { OptionEntity, TableEntity } from "@core/table";

// API GET 
export const getList{{pascalCase name}} = async (pagination:PaginationEntity,options:OptionEntity) => {
  const params = new TableEntity(pagination,options);
  return await httpRepository.execute({
    path: '/api/{{name}}',
    showSuccess: false,
    showError: false,
    params,
    convert: (res) => {
      return {
        data: {{pascalCase name}}Entity.createList{{pascalCase name}}(res?.pagedData),
        info: new PaginationEntity(res?.pageInfo)
      };
    }
  });
};
  //and get detail
export const getDetail{{pascalCase name}} = async (id) => {
  return await httpRepository.execute({
    path: '/api/{{name}}/' + id,
    showSuccess: false,
    showError: false,
    convert: (res) => {
      return new {{pascalCase name}}Entity(res);
    }
  });
};


//API ADD
export const create{{pascalCase name}} = async (payload) => {
  return await httpRepository.execute({
    path: '/api/{{name}}',
    method: "post",
    payload
  })
}


//API EDIT/UPDATE
export const update{{pascalCase name}} = async (id, payload) => {
  return await httpRepository.execute({
    path: '/api/{{name}}/' + id,
    method: "put",
    payload
  })
}

//API DELETE
export const delete{{pascalCase name}} = async (id) => {
  return await httpRepository.execute({
    path: '/api/{{name}}/' + id,
    method: "delete",
  });
};