import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import authenticationPresenter from '@modules/authentication/presenter';
import { useAsync } from '@shared/hook/useAsync';
import { useAltaIntl } from '@shared/hook/useTranslate';

import NavLinkBottom from '../components/NavLinkBottom';
import TokenErrorStatus from './components/TokenErrorStatus';
import UpdatePasswordForm from './components/UpdatePasswordForm';

const ResetPassword = () => {
  const history = useHistory();
  const { formatMessage } = useAltaIntl();
  const [isRecoveryToken, setIsRecoveryToken] = useState<Boolean>(true);
  const { CheckRecoveryToken } = authenticationPresenter;
  const [CheckRecoveryTokenCall] = useAsync(CheckRecoveryToken);
  const { token } = useParams<{ token: any }>();

  useEffect(() => {
    CheckRecoveryTokenCall.execute(token)
      .then(res => {
        setIsRecoveryToken(true);
      })
      .catch(err => {
        setIsRecoveryToken(false);
      });
  }, []);

  return (
    <>
      {!isRecoveryToken ? <UpdatePasswordForm recoveryToken={token} /> : <TokenErrorStatus />}
      <NavLinkBottom
        navLink={formatMessage('link.return.login')}
        onClick={() => history.push('/login')}
      />
    </>
  );
};
export default ResetPassword;
