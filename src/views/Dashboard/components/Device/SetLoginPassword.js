import React, { useState } from 'react';
import {
  CardContent,
  CardHeader,
  Grid,
  Divider,
  TextField,
  Button,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import apis from 'apis';

const SetLoginPassword = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [newPassword, setNewPassword] = useState('');
  const [newSecondPassword, setNewSecondPassword] = useState('');

  const saveNewPassword = () => {
    if(newPassword !== newSecondPassword){
      enqueueSnackbar("两次输入的密码不一致，请修正。", {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      }, 2);
      return
    }
    apis.updatePassword({
      newPassword: newPassword,
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
      }
    })
  }

  return (
    <>
      <CardHeader title="修改密码" />
      <Divider />
      <CardContent>
        <Grid container spacing={2} >
          <Grid item xs={4} >
            <TextField
              style={{ width: "100%" }}
              size="small"
              label="新密码"
              type="password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} />
          </Grid>
          <Grid item xs={4} >
            <TextField
              style={{ width: "100%" }}
              size="small"
              label="再次输入密码"
              type="password"
              variant="outlined"
              value={newSecondPassword}
              onChange={(e) => setNewSecondPassword(e.target.value)} />
          </Grid>
          <Grid item xs={2} >
            <Button fullWidth variant="contained" color="primary" onClick={saveNewPassword}>
              应用
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
};

export default SetLoginPassword;