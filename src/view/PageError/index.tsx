import './styles.scss';

import { Button } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { logo } from '@assets/images';
import CONFIG from '@config';
import store from '@core/store/redux';
import { removeProfile } from '@modules/authentication/profileStore';

const PageError: React.FC = () => {
  const history = useHistory();
  const intl = useIntl();

  return (
    <div className="page-error">
      <div className="main-content">
        <div className="label-logo-forgot">
          <img src={logo} alt="pepsico" />
        </div>
        <div className="content__body">
          <div className="title-404">{intl.formatMessage({ id: 'common.404error' })}</div>
          <div className="page-not-found">{intl.formatMessage({ id: 'common.page.notfound' })}</div>
          <p className="note-404">{intl.formatMessage({ id: 'common.404note' })}</p>
          <div className="button-group">
            <Button className="normal-button btn-return">
              <a onClick={() => history.push('/')}>
                {intl.formatMessage({ id: 'common.button.return.home' })}
              </a>
            </Button>
            <Button className="normal-button">
              <a
                onClick={() => (
                  store.dispatch(removeProfile()), (window.location.href = CONFIG.LOGIN_PAGE)
                )}
              >
                {intl.formatMessage({ id: 'common.login.page' })}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageError;
