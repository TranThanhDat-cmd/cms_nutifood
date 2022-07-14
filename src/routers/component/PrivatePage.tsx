import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from 'react-router-dom';
import DefaultLayout from 'src/layout/index';

import config from '@config/index';
import { RootState } from '@modules';
import authenticationPresenter from '@modules/authentication/presenter';
import profileStore from '@modules/authentication/profileStore';
import UserEntity from '@modules/user/entity';
import { Selector } from '@reduxjs/toolkit';

import { privateRouter } from '../index';
import ShowRouter from './ShowRouter';

interface IPrivatePageSelector {
  token?: string;
  statusLogin?: boolean;
  remember?: boolean;
}

const PrivatePageSelector: Selector<RootState, IPrivatePageSelector> = (state: RootState) => {
  return {
    token: state.profile.token,
    statusLogin: state.profile.statusLogin,
    remember: state.profile.remember,
  };
};

const PrivatePage: React.FC = () => {
  const dispatch = useDispatch();
  const { token, statusLogin } = useSelector(PrivatePageSelector);

  useEffect(() => {
    if (token) {
      // authenticationPresenter.getProfile().then((user: UserEntity) => {
      //   dispatch(profileStore.actions.fetchProfile({ user }));
      // });
    } else {
      window.location.href = config.LOGIN_PAGE;
    }
  }, [token]);
  // if(!statusLogin){
  //   return  <Switch></Switch>
  // }
  return <Switch>{ShowRouter({ routers: privateRouter, MasterLayout: DefaultLayout })}</Switch>;
};
export default PrivatePage;
