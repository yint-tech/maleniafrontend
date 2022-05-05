import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  TextField
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { AppContext } from 'adapter';
import moment from 'moment';
import clsx from 'clsx';
import apis from 'apis';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.error.dark
  },
  differenceValue: {
    color: theme.palette.error.dark,
    marginRight: theme.spacing(1)
  },
  mb: {
    marginBottom: theme.spacing(2)
  },
  maxHeight: {
    width: '100%',
    maxHeight: 200,
    overflowY: 'auto'
  }
}));

const Budget = props => {
  const { user, setUser } = useContext(AppContext);
  const { className } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [proxyName, setProxyName] = useState('');
  const [proxyPassword, setProxyPassword] = useState('');

  useEffect(() => {
    setProxyName(user.authAccount);
    setProxyPassword(user.authPwd);
  }, [user]);

  const saveProxyAccount = () => {
    apis.setAuth({
      authAccount: proxyName,
      authPassword: proxyPassword
    }).then(res => {
      if (res.status !== 0) {
        enqueueSnackbar(res.errorMessage || res.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        }, 2);
      } else {
        enqueueSnackbar("操作成功", {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        }, 2);
        let temp = { ...user, ...res.data };
        apis.setStore(temp);
        setUser({
          ...temp,
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        });
      }
    })
  }

  return (
    <section className={clsx(classes.root, className)}>
      <Card className={classes.mb}>
        <CardHeader title="IP 白名单" />
        <Divider />
        <CardContent>
          <Grid container>
            <Grid item className={classes.maxHeight}>
              {props.whitelist.map((item, index) => (
                <Typography key={item.whiteIp + index} variant="h6">{item.whiteIp}</Typography>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card className={classes.mb}>
        <CardHeader title="设备" />
        <Divider />
        <CardContent>
          <Grid container>
            <Grid item className={classes.maxHeight}>
              {props.device.map((item, index) => (
                <Typography key={item.clientId + index} variant="h6">{item.clientId}</Typography>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="代理账号密码设置" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={6}
            >
              <TextField
                style={{ width: "100%" }}
                size="small"
                label="账号"
                variant="outlined"
                value={proxyName}
                onChange={(e) => setProxyName(e.target.value)} />
            </Grid>
            <Grid
              item
              xs={6}
            >
              <TextField
                style={{ width: "100%" }}
                size="small"
                label="密码"
                variant="outlined"
                type="password"
                value={proxyPassword}
                onChange={(e) => setProxyPassword(e.target.value)} />
            </Grid>
            <Grid
              item
              xs={12}
            >
              <Button fullWidth variant="contained" color="primary" onClick={saveProxyAccount}>
                应用
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </section>
  );
};

export default Budget;
