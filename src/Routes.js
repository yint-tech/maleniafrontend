import React, { useContext } from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import { AppContext } from 'adapter';

import {
  Dashboard as DashboardView,
  ProxyNode as ProxyNodeView,
  Policy as PolicyView,
  Proxy as ProxyView,
  Account as AccountView,
  Whitelist as WhitelistView,
  Config as ConfigView,
  Log as LogView,
  ProxyProductEdit as ProxyProductEditView,
  ProxyProduct as ProxyProductView,
  ProductSource as ProductSourceView,
  UserPrivateProduct as UserPrivateProductView,
  IpResource as IpResourceView,
  IpResourceEdit as IpResourceEditView,
  SignIn as SignInView,
  SignUp as SignUpView,
  NotFound as NotFoundView,
  File as FileView,
} from './views';

const PrivateRoute = ({ ...rest }) => {
  const { user } = useContext(AppContext);
  return !user.overdue ? (
    <RouteWithLayout {...rest} />
  ) : (
    <Redirect
      to={{
        pathname: "/sign-in"
      }}
    />
  );
}

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/dashboard"
      />
      <PrivateRoute
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <PrivateRoute
        component={ProductSourceView}
        exact
        layout={MainLayout}
        path="/productSourceEdit/:id?"
      />
      <PrivateRoute
        component={ProxyProductView}
        exact
        layout={MainLayout}
        path="/proxyProduct"
      />
      <PrivateRoute
        component={ProxyProductEditView}
        exact
        layout={MainLayout}
        path="/proxyProductEdit/:id?"
      />
      <PrivateRoute
        component={IpResourceView}
        exact
        layout={MainLayout}
        path="/ipResource"
      />
      <PrivateRoute
        component={FileView}
        exact
        layout={MainLayout}
        path="/file"
      />
      <PrivateRoute
        component={UserPrivateProductView}
        exact
        layout={MainLayout}
        path="/userPrivateProduct"
      />
      <PrivateRoute
        component={IpResourceEditView}
        exact
        layout={MainLayout}
        path="/ipResourceEdit/:id?"
      />
      <PrivateRoute
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <PrivateRoute
        component={LogView}
        exact
        layout={MainLayout}
        path="/log"
      />
      <PrivateRoute
        component={ProxyNodeView}
        exact
        layout={MainLayout}
        path="/proxyNodes"
      />
      <PrivateRoute
        component={WhitelistView}
        exact
        layout={MainLayout}
        path="/whitelist"
      />
      <PrivateRoute
        component={ConfigView}
        exact
        layout={MainLayout}
        path="/config"
      />
      <PrivateRoute
        component={PolicyView}
        exact
        layout={MainLayout}
        path="/policy"
      />
      <PrivateRoute
        component={ProxyView}
        exact
        layout={MainLayout}
        path="/proxy"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
