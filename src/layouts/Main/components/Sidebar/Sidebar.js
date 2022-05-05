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
      title: '白名单配置',
      href: '/whitelist',
      icon: <FlipIcon />
    },
    {
      title: '已购产品',
      href: '/policy',
      icon: <GrainIcon />
    },
    {
      title: '产品列表',
      href: '/proxyProduct',
      icon: <ImportantDevicesIcon />
    },
    {
      title: '中间人注入',
      href: '/file',
      icon: <PeopleIcon />
    }
  ];

  if (user.isAdmin) {
    pages = pages.concat([{
      title: '私有产品',
      href: '/userPrivateProduct',
      icon: <PersonAddIcon />
    }, {
      title: 'IP资源',
      href: '/ipResource',
      icon: <DnsIcon />
    }, {
      title: '账号信息',
      href: '/account',
      icon: <ChildCareIcon />
    }, {
      title: '服务器列表',
      href: '/proxyNodes',
      icon: <CellWifiIcon />
    }, {
      title: '日志',
      href: '/log',
      icon: <PermDeviceInformationIcon />
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
