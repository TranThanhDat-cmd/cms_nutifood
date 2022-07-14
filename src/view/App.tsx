import '@shared/assets/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import '@styles/styles.scss';

import { ConfigProvider } from 'antd';
import lodash from 'lodash';
import React, { Suspense, useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import locale from '@locale/index';
import authenticationPresenter from '@modules/authentication/presenter';
import profileStore, { TokenSelector } from '@modules/authentication/profileStore';
import { LanguageSelector } from '@modules/setting/settingStore';
import UserEntity from '@modules/user/entity';
import Loading from '@shared/components/Loading';
import { useAsync } from '@shared/hook/useAsync';

import PrivatePage from '../routers/component/PrivatePage';
import PublicPage from '../routers/component/PublicPage';

// For Test
const App = () => {
  const dispatch = useDispatch();
  const { token, status } = useSelector(TokenSelector);
  const { language } = useSelector(LanguageSelector);
  const { getProfile } = authenticationPresenter;
  const [getProfileCall] = useAsync(getProfile);

  const memoLangData = React.useMemo(() => {
    return locale[language];
  }, [language]);

  useEffect(() => {
    if (lodash.isEmpty(token)) {
      return;
    }
    getProfileCall.execute({}).then((user: UserEntity) => {
      dispatch(profileStore.actions.fetchProfile({ user }));
    });
  }, [token]);

  return (
    <IntlProvider locale={language} messages={memoLangData}>
      <ConfigProvider locale={memoLangData}>
        {getProfileCall.status == 'loading' ? <Loading /> : <MainView statusLogin={status} />}
      </ConfigProvider>
    </IntlProvider>
  );
};

const MainView = React.memo(({ statusLogin }: { statusLogin: boolean }) => {
  return (
    <>
      {statusLogin ? (
        <Suspense fallback={<></>}>
          <PrivatePage />
        </Suspense>
      ) : (
        <Suspense fallback={<></>}>
          <PublicPage />
        </Suspense>
      )}
    </>
  );
});

export default App;
