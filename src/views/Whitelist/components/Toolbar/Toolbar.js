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
import QueuePlayNextIcon from '@material-ui/icons/QueuePlayNext';

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
    width: '100%',
    marginBottom: theme.spacing(2)
  },
}));

const Toolbar = props => {
  const { className, onInputChange, setRefresh, ...rest } = props;

  const classes = useStyles();
  const [account, setAccount] = useState('');
  const [desc, setDesc] = useState('');

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
          startIcon={<QueuePlayNextIcon />}
          color="primary"
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          添加白名单
        </Button>
      </div>
      <OpeDialog
        title="添加白名单"
        opeContent={(
          <>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12} >
                <Typography gutterBottom variant="h6" >IP</Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)} />
                <Typography gutterBottom variant="h6" >
                  IP 配置支持
                  <a
                    href="https://baike.baidu.com/item/%E6%97%A0%E7%B1%BB%E5%88%AB%E5%9F%9F%E9%97%B4%E8%B7%AF%E7%94%B1"
                    target="_blank"
                    rel="noopener noreferrer"> CIDR 规则</a>
                </Typography>
                <Typography gutterBottom variant="subtitle2" >
                  eg. 208.128.0.0/11、208.130.29.0/24
                </Typography>
                <Typography gutterBottom variant="h6" >描述</Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)} />
              </Grid>
            </Grid>
          </>
        )}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return apis.whiteListAdd({
            ip: account,
            comment: desc
          }).then(res => {
            if (res.status === 0) {
              setRefresh(+new Date());
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
