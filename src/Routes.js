import React, { useContext } from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import { AppContext } from 'adapter';

import {
  Dashboard as DashboardView,
  Account as AccountView,
  Whitelist as WhitelistView,
  ProxyProductEdit as ProxyProductEditView,
  Product as ProductView,
  ProductSource as ProductSourceView,
  IpResourceEdit as IpResourceEditView,
  SignIn as SignInView,
  SignUp as SignUpView,
  NotFound as NotFoundView,
  MITM as MITMView,
  System as SystemView
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
        component={ProductView}
        exact
        layout={MainLayout}
        path="/product"
      />
      <PrivateRoute
        component={ProxyProductEditView}
        exact
        layout={MainLayout}
        path="/proxyProductEdit/:id?"
      />
      <PrivateRoute
        component={MITMView}
        exact
        layout={MainLayout}
        path="/mitm"
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
        component={SystemView}
        exact
        layout={MainLayout}
        path="/system"
      />

      <PrivateRoute
        component={WhitelistView}
        exact
        layout={MainLayout}
        path="/whitelist"
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
