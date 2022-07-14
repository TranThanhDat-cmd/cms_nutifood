import React, { Component, PropsWithChildren, ReactNode } from 'react';
import { useHistory, useLocation, withRouter } from 'react-router-dom';
import HeaderComponent from './Header';
interface IDefaultLayoutProps {
  history: any;
}

const Layout: React.FC<PropsWithChildren<IDefaultLayoutProps>> = props => {
  return (
    <div className="all-page-component">
      <div className="right-page-component">
        <div className="w-100 d-flex flex-row-reverse">
          <HeaderComponent />
        </div>
        <div className="main-component">{props.children}</div>
      </div>
    </div>
  );
};

export default React.memo(withRouter(Layout));
