import { Button, Checkbox, Form, Input } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useAsync } from '@hook/useAsync';
import authenticationPresenter from '@modules/authentication/presenter';
import { useAltaIntl } from '@shared/hook/useTranslate';

import RenderError from '../components/RenderError';

const Login = () => {
  const history = useHistory();
  const { formatMessage } = useAltaIntl();
  const { login } = authenticationPresenter;
  const [loginByAccount] = useAsync(login);
  const [errorStatus, setErrorStatus] = useState('');
  const onFinishFailed = (errorInfo: any) => {
    setErrorStatus('');
  };
  const onSubmitAccount = (values: any) => {
    const remember = values.remember;
    delete values.remember;
    document.cookie = `remember_me=${remember}; SameSite=None; Secure`;
    loginByAccount
      .execute(values, remember)
      .then(res => {
        setErrorStatus('');
        setTimeout(() => {
          history.push('/');
        }, 300);
      })
      .catch(err => {
        setErrorStatus(formatMessage('login.account.error'));
      });
  };

  return (
    <div className="main-form auth-form">
      <h3 className="main-title">{formatMessage('login.title')}</h3>
      <div className="content-form">
        <Form
          name="loginByAccount"
          layout="vertical"
          onFinish={onSubmitAccount}
          onFinishFailed={onFinishFailed}
          requiredMark={false}
          initialValues={{
            remember: false,
          }}
        >
          <Form.Item
            label={formatMessage('login.userName')}
            name="userName"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder={formatMessage('login.userName')} />
          </Form.Item>
          <Form.Item
            label={formatMessage('auth.password')}
            name="password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password placeholder={formatMessage('auth.password')} />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked" className="remember__login">
            <Checkbox>{formatMessage('login.remember')}</Checkbox>
          </Form.Item>
          {errorStatus && <RenderError errorStatus={errorStatus} />}
          <Button htmlType="submit" className="normal-button">
            {formatMessage('login.button.account')}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
