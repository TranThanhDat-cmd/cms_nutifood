import { ILocale } from '@locale/interface';
import { useIntl } from 'react-intl';

export const useAltaIntl = () => {
  const intl = useIntl();
  const formatMessage = (key: keyof ILocale): string => {
    return intl.formatMessage({ id: key });
  };
  return {
    intl,
    formatMessage,
  };
};
