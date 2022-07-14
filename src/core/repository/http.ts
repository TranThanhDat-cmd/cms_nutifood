import { message } from 'antd';
import axios, { AxiosInstance } from 'axios';
import lodash from 'lodash';

import CONFIG from '@config/index';
import store from '@core/store/redux';
import locale, { Locale } from '@locale/index';
import { RootState } from '@modules';
import { removeProfile } from '@modules/authentication/profileStore';

export interface IParamsHTTP {
  method?: 'get' | 'post' | 'delete' | 'put';
  path: string;
  payload?: any;
  params?;
  config?: {
    isPrivate?: boolean;
    isFormData?: boolean;
  };
  showSuccess?: boolean;
  showError?: boolean;
  convert?: (res) => any;
}

export class HTTPRepository {
  private service: AxiosInstance;
  private token?: any;
  private language: keyof Locale = 'en';

  constructor(baseURL?) {
    this.service = axios.create({
      baseURL: baseURL || CONFIG.API_BASE_URL,
      withCredentials: false,
    });
    const state: RootState = store.getState();
    this.token = state?.profile?.token;
    this.language = state.settingStore.language;

    store.subscribe(() => {
      const state: RootState = store.getState();
      this.token = state.profile.token;
      this.language = state.settingStore.language;
    });
  }

  private handleSuccess(response, convert, showSuccess) {
    if (showSuccess) {
      message.success(locale[this.language][response?.data?.message] || response?.data?.message);
    }
    if (convert != undefined) {
      return Promise.resolve(convert(response.data?.data));
    }
    return Promise.resolve(response);
  }

  private handleError(error, showError) {
    let status = error.response?.status;
    switch (status) {
      case 400: {
        if (showError) {
          message.error(
            locale[this.language][error.response?.data?.message] || error.response?.data?.message
          );
        }
        break;
      }
      case 401: {
        store.dispatch(removeProfile());
        window.location.href = CONFIG.LOGIN_PAGE;
        break;
      }
      case 500: {
        message.error(
          locale[this.language][error.response?.data?.message] || error.response?.data?.message
        );
        break;
      }
      case undefined: {
        if (showError) {
          message.error(locale[this.language]['server.networkError']);
        }
        break;
      }
      default: {
        if (showError) {
          message.error('HTTP CODE ' + status);
        }
        break;
      }
    }
    return Promise.reject(error);
  }

  private preparePrivateHeaderConfig() {
    if (lodash.isEmpty(this.token)) {
      return {};
    }
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }

  private getDefaultConfig({ isFormData }: any = {}) {
    const config = {
      headers: {},
    };

    const privateHeaderConfig = this.preparePrivateHeaderConfig();
    Object.assign(config.headers, privateHeaderConfig);

    if (isFormData) {
      Object.assign(config.headers, {
        'Content-Type': 'multipart/form-data',
      });
    }
    return config;
  }

  execute({
    method = 'get',
    path = '',
    payload,
    config = {},
    params,
    showSuccess = true,
    showError = true,
    convert = res => res,
  }: IParamsHTTP) {
    let args: Array<any>;
    const { isFormData = false } = config;

    switch (method) {
      case 'get': {
        if (params) {
          args = [
            path,
            {
              ...this.getDefaultConfig(),
              params,
            },
          ];
        } else {
          args = [path, this.getDefaultConfig()];
        }
        break;
      }
      case 'delete': {
        args = [
          path,
          {
            data: payload,
            ...this.getDefaultConfig(),
            params: params ? params : null,
          },
        ];
        break;
      }
      case 'post':
      case 'put': {
        let data = payload;
        if (isFormData) {
          data = new FormData();
          const arrKey = Object.getOwnPropertyNames(payload);
          data = arrKey.reduce((form, item) => {
            if (payload[item] !== undefined) {
              const value = payload[item];
              if (Array.isArray(value)) {
                for (let i = 0; i < value.length; i++) {
                  const it = value[i];
                  if (typeof it === 'string') {
                    form.append(`${item}[${i}]`, it);
                  } else {
                    Object.keys(it).forEach((f: any) => {
                      form.append(`${item}[${i}].${f}`, it[f]);
                    });
                  }
                }
              } else {
                form.append(item, value);
              }
            }
            return form;
          }, new FormData());
        }
        args = [path, data, this.getDefaultConfig({ isFormData })];
        break;
      }

      default:
        break;
    }
    //@ts-ignore
    return this.service[method](...args)
      .then(response => {
        return this.handleSuccess(response, convert, showSuccess);
      })
      .catch(error => this.handleError(error, showError));
  }
}

const httpRepository = new HTTPRepository();

export default httpRepository;
