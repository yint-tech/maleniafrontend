import React, { useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import DashboardIcon from '@material-ui/icons/Dashboard';
import CellWifiIcon from '@material-ui/icons/CellWifi';
import GrainIcon from '@material-ui/icons/Grain';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PeopleIcon from '@material-ui/icons/People';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';
import DnsIcon from '@material-ui/icons/Dns';
import PermDeviceInformationIcon from '@material-ui/icons/PermDeviceInformation';
import FlipIcon from '@material-ui/icons/Flip';
import DashboardSharpIcon from '@material-ui/icons/DashboardSharp';
import SettingsIcon from '@material-ui/icons/Settings';
import { AppContext } from 'adapter';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';

import { Profile, SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { user } = useContext(AppContext);
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  let pages = [
    {
      title: '概览',
      href: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'IP白名单',
      href: '/whitelist',
      icon: <FlipIcon />
    },
    {
      title: '代理产品',
      href: '/product',
      icon: <GrainIcon />
    },
    {
      title: '中间人注入',
      href: '/mitm',
      icon: <PeopleIcon />
    }
  ];

  if (user.isAdmin) {
    pages = pages.concat([{
      title: '账号信息',
      href: '/account',
      icon: <ChildCareIcon />
    }, {
      title: "系统面板",
      href: "/system",
      icon: <DashboardSharpIcon/>
    }]);
  }

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
