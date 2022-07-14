import React from 'react';
import { useLocation } from 'react-router-dom';

export function searchToObject(search: string): any {
  var pairs = search.substring(1).split('&'),
    obj = {},
    pair,
    i;

  for (i in pairs) {
    if (pairs[i] === '') continue;
    pair = pairs[i].split('=');
    const key = decodeURIComponent(pair[0]).toLocaleLowerCase();
    obj[key] = decodeURIComponent(pair[1]);
  }

  return obj;
}

export function useQueryParams() {
  const location = useLocation();
  const query = React.useMemo(() => {
    return searchToObject(location.search);
  }, []);
  return query;
}
export function toSearch(queryParams) {
  return Object.keys(queryParams)
    .filter(key => queryParams[key] !== undefined)
    .map(key => `${key}=${encodeURIComponent(toString(queryParams[key]))}`)
    .join('&');
}

export function toString(data: any) {
  if (typeof data != 'object') {
    return data;
  }
  try {
    return JSON.stringify(data);
  } catch (e) {}
}
