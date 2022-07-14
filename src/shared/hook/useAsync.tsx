import { useState, useCallback } from 'react';

interface IState<T> {
  status: 'ready' | 'loading' | 'error';
  value: T;
  error: any;
}

interface IOptions {
  showError?: boolean;
  showSuccess?: boolean;
}

export function useSingleAsync<T>(asyncFunction, options?: IOptions) {
  if (!asyncFunction) return;
  const { showError = true, showSuccess = false } = options || {};

  const [state, setState] = useState<IState<T>>({
    status: 'ready',
    value: null,
    error: null,
  });

  const onSuccess = (response: T) => {
    setState(prevState => ({
      ...prevState,
      status: 'ready',
      value: response,
    }));
    return Promise.resolve(response);
  };

  const onError = error => {
    setState(prevState => ({
      ...prevState,
      status: 'error',
      error: error,
    }));
    return Promise.reject(error);
  };

  const execute = useCallback(
    (...args) => {
      setState(prevState => ({
        ...prevState,
        status: 'loading',
        value: null,
        error: null,
      }));

      return asyncFunction(...args)
        .then(onSuccess)
        .catch(onError);
    },
    [asyncFunction]
  );

  return { execute, ...state };
}

interface IMutipleAsync extends IState<any> {
  execute: Function;
}

export const useAsync = function (
  ...params: Array<Function | [Function, IOptions?]>
): IMutipleAsync[] {
  return params
    .map(item => {
      if (Array.isArray(item)) {
        if (item.length > 0) {
          return useSingleAsync(item[0]);
        }
        return undefined;
      }
      return useSingleAsync(item);
    })
    .filter(ii => ii !== null);
};
