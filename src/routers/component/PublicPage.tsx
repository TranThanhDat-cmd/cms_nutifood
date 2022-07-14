import React, { useEffect } from 'react';
import { publicRouter } from '../index';
import ShowRouter from './ShowRouter';
import { Switch } from 'react-router-dom';
import AuthLayout from '@view/Auth/components/AuthLayout';

const PublicPage: React.FC = () => {
  return <Switch>{ShowRouter({ routers: publicRouter, MasterLayout: AuthLayout })}</Switch>;
};
export default PublicPage;
