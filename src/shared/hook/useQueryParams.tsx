import { useLocation } from 'react-router-dom';

export function useQueryParams() {
  const query = new URLSearchParams(useLocation().search);
  return query;
}
