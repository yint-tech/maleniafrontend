import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { SearchInput, OpeDialog } from 'components';
import {
  Button,
  TextField,
  Typography,
  Grid
} from '@material-ui/core';

import clsx from 'clsx';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

import apis from 'apis';

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {},
  dialog: {
    width: theme.spacing(60)
  },
  dialogInput: {
    width: '100%'
  },
}));

const Toolbar = props => {
  const { className, onInputChange, setRefresh, ...rest } = props;

  const classes = useStyles();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          onChange={(v) => onInputChange(v)}
          placeholder="请输入关键词进行查询"
        />
        <span className={classes.spacer} />
        <Button
          startIcon={<EmojiPeopleIcon />}
          color="primary"
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          添加用户
        </Button>
      </div>
      <OpeDialog
        title="添加用户"
        opeContent={(
          <>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid
                item
                xs={6}
              >
                <Typography
                  gutterBottom
                  variant="h6"
                >
                  账号
                </Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)} />
              </Grid>
              <Grid
                item
                xs={6}
              >
                <Typography
                  gutterBottom
                  variant="h6"
                >
                  密码
                </Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </Grid>
            </Grid>
          </>
        )}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return apis.userAdd({
            userName: account,
            password: password
          }).then(res => {
            if (res.status === 0) {
              setRefresh(+new Date());
              setOpenDialog(false);
              return '操作成功';
            }
            throw new Error(res.message);
          });
        }}
        okText="保存"
        okType="primary" />
    </div>
  );
};

export default Toolbar;
