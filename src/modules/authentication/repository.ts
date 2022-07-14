import moment from 'moment';

import httpRepository from '@core/repository/http';
import User from '@modules/user/entity';

const register = async payload => {
  return await httpRepository.execute({
    path: '/auth/register',
    method: 'post',
    payload,
    config: { isPrivate: false },
  });
};

const forgotPass = async payload => {
  return await httpRepository.execute({
    path: `api/Users/PasswordRecovery?UserName=${payload.email}`,
    method: 'get',
    showSuccess: false,
    showError: false,
    // payload,
    config: { isPrivate: false },
  });
};

const CheckRecoveryToken = async payload => {
  return await httpRepository.execute({
    path: `api/Users/CheckRecoveryToken?recoveryToken=${payload}`,
    method: 'get',
    // payload,
    showSuccess: false,
    showError: false,
    config: { isPrivate: false },
  });
};

const updatePassword = async payload => {
  return await httpRepository.execute({
    path: `/api/Users/ChangePassword`,
    method: 'post',
    payload,
    showSuccess: false,
    showError: false,
    config: { isPrivate: true },
  });
};

export interface ILoginDTO {
  accountUserName: string;
  accountPassword: string;
  applicationId?: string;
}

const login = async (payload: ILoginDTO) => {
  return await httpRepository.execute({
    path: '/api/Users/SignIn',
    method: 'post',
    payload,
    config: { isPrivate: false },
  });
};

export interface IGetOtpCode {
  accountPhone: string;
  reCaptcha: string;
}

const getOtpCode = async (payload: IGetOtpCode) => {
  return await httpRepository.execute({
    path: '/api/Users/Login',
    method: 'post',
    payload,
    config: { isPrivate: false },
  });
};
export interface ILoginOTP {
  otpCode: string;
  accountId: string;
}

const loginByOTPCode = async (payload: ILoginOTP) => {
  return await httpRepository.execute({
    path: '/api/Users/VerifyLogin',
    method: 'post',
    payload,
  });
};

const logout = async () => {
  return await httpRepository.execute({
    path: '/api/Users/logout',
    method: 'get',
    showSuccess: false,
    config: { isPrivate: true },
  });
};

const resetPass = async (value, otp) => {
  return await httpRepository.execute({
    path: `/api/Users/resetForgotPassword/key=${otp}`,
    method: 'put',
    payload: value,
    showSuccess: false,
    showError: false,
    config: { isPrivate: false },
  });
};

const getProfile = async () => {
  return await httpRepository.execute({
    path: '/api/Users/Profile',
    method: 'get',
    showSuccess: false,
    convert: res => {
      return new User(res);
    },
  });
};

const uploadAvatar = async payload => {
  return await httpRepository.execute({
    path: 'api/Users',
    method: 'put',
    payload,
  });
};

const updateProfileUser = async payload => {
  const response = await httpRepository.execute({
    path: 'api/Users/Profile',
    method: 'put',
    payload,
    config: { isPrivate: true, isFormData: true },
  });
  return response;
};

const verifyCode = async code => {
  return await httpRepository.execute({
    path: '/api/Accounts/Auth',
    showSuccess: false,
    params: { code },
    convert: data => {
      return data?.accessToken;
    },
  });
};

export default {
  register,
  login,
  logout,
  resetPass,
  forgotPass,
  CheckRecoveryToken,
  updatePassword,
  getProfile,
  uploadAvatar,
  updateProfileUser,
  getOtpCode,
  loginByOTPCode,
  verifyCode,
};
