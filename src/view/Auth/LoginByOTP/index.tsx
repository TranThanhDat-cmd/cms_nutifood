import { Button, Form, Input, Statistic } from 'antd';
import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { RootState } from '@modules';
import authenticationPresenter from '@modules/authentication/presenter';
import { useAsync } from '@shared/hook/useAsync';
import { useAltaIntl } from '@shared/hook/useTranslate';

import NavLinkBottom from '../components/NavLinkBottom';
import OTPInput from '../components/OTPInput';
import RenderError from '../components/RenderError';

const LoginByOTP = () => {
  const history = useHistory();
  const { formatMessage } = useAltaIntl();
  const { getOtpCode, loginByOTPCode } = authenticationPresenter;
  const [getOTP] = useAsync(getOtpCode);
  const [loginOTP] = useAsync(loginByOTPCode);

  const currentLanguage = useSelector((state: RootState) => state.settingStore.language);
  const { Countdown } = Statistic;
  const [errorStatus, setErrorStatus] = useState('');
  const [pageOTP, setPageOTP] = useState(false);
  const [timeOver, setTimeOver] = useState<number>(0);
  const [otpCode, setOtpCode] = useState('');
  const [errorOTP, setErrorOTP] = useState(false);
  const [countError, setCountError] = useState(0);
  const [numberPhone, setNumberPhone] = useState('');
  const [outOfTime, setOutOfTime] = useState(false);
  const [accountId, setAccountId] = useState('');

  const onFinishFailed = (errorInfo: any) => {
    setErrorStatus('');
    console.log('Failed:', errorInfo);
  };

  const onRequestOTP = (values: any) => {
    getOTP
      .execute(values)
      .then(res => {
        setErrorStatus('');
        setPageOTP(true);
        setNumberPhone(values.phone);
        const deadline = Date.now() + 120 * 1000;
        setTimeOver(deadline);
        setAccountId(res.accountId);
      })
      .catch(err => {
        setErrorStatus(formatMessage('login.mobile.error'));
      });
  };

  const onChangeOTP = otp => {
    const otpString = otp.toString();
    if (otpString.length === 6) {
      setErrorStatus('');
      setOtpCode(otpString);
    } else {
      setErrorStatus(formatMessage('auth.form.required.otp'));
    }
  };

  const onSubmitOTP = (limitSubmit: number) => {
    if (otpCode) {
      const values = { otpCode: otpCode, phone: numberPhone };
      loginOTP
        .execute(values)
        .then(res => {
          setErrorStatus('');
          setTimeout(() => {
            history.push('/');
          }, 300);
        })
        .catch(err => {
          setErrorStatus(formatMessage('auth.opt.error'));
          setOutOfTime(true);
          setCountError(preState => {
            if (preState + 1 === limitSubmit) {
              setErrorOTP(true);
            }
            return preState + 1;
          });
        });
    } else {
      setErrorStatus(formatMessage('auth.form.required.otp'));
    }
  };

  const onResendOTP = () => {
    setOutOfTime(false);
    const deadline = Date.now() + 120 * 1000;
    setTimeOver(deadline);
    setCountError(0);
  };

  return (
    <>
      <div className="main-form auth-form login-otp-form">
        {!pageOTP ? (
          <>
            <h3 className="main-title">{formatMessage('login.title')}</h3>
            <div className="content-form">
              <Form
                name="loginByMobilePhone"
                layout="vertical"
                onFinish={onRequestOTP}
                onFinishFailed={onFinishFailed}
                requiredMark={false}
              >
                <Form.Item
                  label={formatMessage('login.page.mobile')}
                  name="phone"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder={formatMessage('login.page.mobile')} />
                </Form.Item>
                <div className="captcha__box">
                  <Form.Item
                    name="reCaptcha"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <ReCAPTCHA
                      className="g-recaptcha"
                      // Mã dành cho localhost để thử nghiệm
                      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                      hl={currentLanguage}
                    />
                  </Form.Item>
                </div>
                {errorStatus && <RenderError errorStatus={errorStatus} />}
                <Button htmlType="submit" className="normal-button">
                  {formatMessage('login.button.mobile')}
                </Button>
                <div className="or-method__box">
                  <p>Hoặc</p>
                </div>
                <Button onClick={() => history.push('/login')} className="cancel-button">
                  {formatMessage('login.button.by.account')}
                </Button>
              </Form>
            </div>
          </>
        ) : !errorOTP ? (
          <>
            <h3 className="main-title">{formatMessage('login.title')}</h3>
            <div className="otp-input__box">
              <Form name="sendOTP" layout="vertical" requiredMark={false}>
                <div className="otp__box">
                  <Form.Item name="otpCode" label="OTP">
                    <OTPInput
                      autoFocus
                      isNumberInput
                      length={6}
                      className="otpContainer"
                      inputClassName="otpInput"
                      onChangeOTP={otp => onChangeOTP(otp)}
                    />
                    {errorStatus && <RenderError errorStatus={errorStatus} />}
                  </Form.Item>
                </div>
              </Form>
              <div>
                <p className="status-otp">
                  <FormattedMessage
                    id="auth.opt.notification"
                    values={{
                      time: (
                        <Countdown
                          format="ss"
                          value={timeOver}
                          onFinish={() => setOutOfTime(true)}
                        />
                      ),
                      code: word => <span>{word}</span>,
                    }}
                  />
                </p>
                {outOfTime && (
                  <a className="link-otp" onClick={onResendOTP}>
                    {formatMessage('auth.resend.otp')}
                  </a>
                )}
              </div>
              <div>
                <button className="normal-button" onClick={() => onSubmitOTP(5)}>
                  {formatMessage('common.button.accept')}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="lock-account__box">
            <h3 className="main-title">{formatMessage('login.lock.account.title')}</h3>
            <p>{formatMessage('login.lock.account.notification')}</p>
            <Button className="cancel-button">
              {formatMessage('login.button.contact.support')}
            </Button>
          </div>
        )}
      </div>
      <NavLinkBottom
        navLink={formatMessage('link.return.login')}
        onClick={() => history.push('/login')}
      />
    </>
  );
};
export default LoginByOTP;
