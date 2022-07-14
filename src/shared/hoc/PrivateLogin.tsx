import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Selector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '@modules/index';

interface IPrivateLogin {
  token: string;
}

const PrivateLoginSelector: Selector<RootState, IPrivateLogin> = (state: RootState) => {
  return {
    token: state.profile.token,
  };
};

function PrivateLogin(Component: React.ComponentType<any | string>) {
  const { token } = useSelector(PrivateLoginSelector);
  return withRouter(({ history }: RouteComponentProps) => {
    return (
      <>
        <Component privateLogin={!!token} />
      </>
    );
  });
}

export default PrivateLogin;
