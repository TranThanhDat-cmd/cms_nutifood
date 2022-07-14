import { PaginationEntity } from '@core/pagination/entity';
import httpRepository from '@core/repository/http';
import { OptionEntity, TableEntity } from '@core/table';

import QuestionEntity from './entity';

// API GET
export const getListQuestion = async (pagination: PaginationEntity, options: OptionEntity) => {
  const params = new TableEntity(pagination, options);
  return await httpRepository.execute({
    path: '/api/Questions',
    showSuccess: false,
    showError: false,
    params,
    convert: res => {
      return {
        data: QuestionEntity.createListQuestion(res?.pagedData),
        info: new PaginationEntity(res?.pageInfo),
      };
    },
  });
};

//and get detail
export const getDetailQuestion = async id => {
  return await httpRepository.execute({
    path: '/api/question/' + id,
    showSuccess: false,
    showError: false,
    convert: res => {
      return new QuestionEntity(res);
    },
  });
};

//API ADD
export const createQuestion = async payload => {
  return await httpRepository.execute({
    path: '/api/Questions',
    method: 'post',
    payload,
  });
};

//API EDIT/UPDATE
export const updateQuestion = async (id, payload) => {
  return await httpRepository.execute({
    path: '/api/question/' + id,
    method: 'put',
    payload,
  });
};

// API ANSWER
export const answerQuestion = async (id, payload) => {
  return await httpRepository.execute({
    path: `/api/Questions/${id}/AnswerQuestion/`,
    method: 'put',
    payload,
  });
};

//API DELETE
export const deleteQuestion = async id => {
  return await httpRepository.execute({
    path: '/api/Questions/' + id,
    method: 'delete',
  });
};
