import { PaginationEntity } from '@core/pagination/entity';
import httpRepository from '@core/repository/http';
import { OptionEntity, TableEntity } from '@core/table';

import BannerEntity from './entity';

// API GET
export const getListBanner = async (pagination: PaginationEntity, options: OptionEntity) => {
  const params = new TableEntity(pagination, options);
  return await httpRepository.execute({
    path: '/api/Banners',
    showSuccess: false,
    showError: false,
    params,
    convert: res => {
      return {
        data: BannerEntity.createListBanner(res?.pagedData),
        info: new PaginationEntity(res?.pageInfo),
      };
    },
  });
};

//and get detail
export const getDetailBanner = async id => {
  return await httpRepository.execute({
    path: '/api/Banners/' + id,
    showSuccess: false,
    showError: false,
    convert: res => {
      return new BannerEntity(res);
    },
  });
};

//API ADD
export const createBanner = async payload => {
  return await httpRepository.execute({
    path: '/api/Banners',
    method: 'post',
    payload,
    config: { isPrivate: true, isFormData: true },
  });
};

//API ADD BANNER
export const createMediaInBanner = async (id, payload) => {
  return await httpRepository.execute({
    path: `/api/Banners/${id}/BannerMedias`,
    method: 'post',
    payload,
    config: { isPrivate: true, isFormData: true },
  });
};

//API EDIT/UPDATE
export const updateBanner = async (id, payload) => {
  return await httpRepository.execute({
    path: '/api/Banners/' + id,
    method: 'put',
    payload,
    config: { isPrivate: true, isFormData: true },
  });
};

//API DELETE
export const deleteBanner = async id => {
  return await httpRepository.execute({
    path: '/api/Banners/' + id,
    method: 'delete',
  });
};

//API DELETE
export const deleteMediaInBanner = async (id, bannerMediaIds) => {
  return await httpRepository.execute({
    path: `/api/Banners/${id}/BannerMedias`,
    method: 'delete',
    payload: bannerMediaIds,
  });
};
