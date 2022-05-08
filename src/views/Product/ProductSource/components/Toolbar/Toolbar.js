import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { SearchInput, OpeDialog } from 'components';
import { useParams } from 'react-router-dom';
import {
  Button,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem
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
  const [sourceKey, setSourceKey] = useState('');
  const [ratio, setRatio] = useState(1);
  const productId = useParams().id;
  const ipResources = props.ipResources;
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
          添加IP资源
        </Button>
      </div>
      <OpeDialog
        title="添加IP资源"
        opeContent={(
          <>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12} >
                <Typography gutterBottom variant="h6" >IP资源标记</Typography>
                {/* <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  value={sourceKey}
                  onChange={(e) => setSourceKey(e.target.value)} /> */}
                <Select
                      className={classes.dialogInput}
                      size="small"
                      variant="outlined"
                      value={sourceKey}
                      onChange={(e) => setSourceKey(e.target.value)}
                >
                {ipResources.map(item => (
                    <MenuItem key={item.sourceKey} value={item.sourceKey}>
                        <pre>{item.sourceKey}</pre>
                    </MenuItem>
                ))}
                </Select>
                <Typography gutterBottom variant="h6" >比例</Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  value={ratio}
                  onChange={(e) => setRatio(e.target.value)} />
              </Grid>
            </Grid>
          </>
        )}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return apis.addSourceToProduct({
            sourceKey: sourceKey,
            productId: productId,
            ratio: ratio
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
