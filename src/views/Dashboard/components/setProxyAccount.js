import React, { useContext, useEffect, useState } from 'react';
import {
  CardContent,
  CardHeader,
  Grid,
  Divider,
  TextField,
  Button
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { AppContext } from 'adapter';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import apis from 'apis';

const Proxy = () => {
  const { user, setUser } = useContext(AppContext);
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
    <>
      <CardHeader title="代理账号密码设置" />
      {!user.authAccount && (
        <Alert severity="warning">
          <AlertTitle>紧急！！！</AlertTitle>
          未设置代理账号密码服务将容易泄漏账号密码，请尽量设置独立的代理账号密码
        </Alert>
      )}
      <Divider />
      <CardContent>
        <Grid container spacing={2} >
          <Grid item xs={4} >
            <TextField
              style={{ width: "100%" }}
              size="small"
              label="代理账户"
              variant="outlined"
              value={proxyName}
              onChange={(e) => setProxyName(e.target.value)} />
          </Grid>
          <Grid item xs={4} >
            <TextField
              style={{ width: "100%" }}
              size="small"
              label="代理密码"
              variant="outlined"
              value={proxyPassword}
              onChange={(e) => setProxyPassword(e.target.value)} />
          </Grid>
          <Grid item xs={2} >
            <Button fullWidth variant="contained" color="primary" onClick={saveProxyAccount}>
              应用
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

export default Proxy;
