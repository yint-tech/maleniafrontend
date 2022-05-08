import React, { useState } from 'react';
import clsx from 'clsx';
import { OpeDialog } from 'components';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Table } from 'views/common';
import QueuePlayNextIcon from '@material-ui/icons/QueuePlayNext';
import { useSnackbar } from 'notistack';
import {
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem
} from '@material-ui/core';

import apis from 'apis';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    justifyContent: 'center'
  },
  tableButton: {
    marginRight: theme.spacing(1)
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
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
  inputItem: {
    width: '100%'
  },
  dialogInput: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
}));

const DataTable = props => {
  const { enqueueSnackbar } = useSnackbar();
  const { className, data, total, rowsPerPage, pageState, setRefresh, ...rest } = props;
  const [page, setPage] = pageState;

  const classes = useStyles();

  const [openDialog, setOpenDialog] = useState(false);
  const [sourceKey, setSourceKey] = useState('');
  const [ratio, setRatio] = useState(1);
  const ipResources = props.ipResources;
  const productId = props.productId;

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const doDelete = (itemId) => {
    apis
      .deleteProductResource({ id: itemId })
      .then(res => {
        if (res.status === 0) {
          enqueueSnackbar('删除成功', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
          setRefresh(+new Date());
        } else {
          enqueueSnackbar(res.error, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
        }
      }).catch((e) => {
        enqueueSnackbar(e.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      });
  }

  return (
    <div>
      <div>

        <OpeDialog
          title="添加IP资源"
          opeContent={(
            <>
              <Grid container spacing={12} wrap="wrap" >
                <Grid item xs={12} >
                  <Typography gutterBottom variant="h6" >资源标记</Typography>
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
                    className={classes.inputItem}
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
                setSourceKey("");
                setRatio(1);
                return '操作成功';
              }
              throw new Error(res.message);
            });
          }}
          okText="保存"
          okType="primary" />
      
      
      </div>

      <Button
              startIcon={<QueuePlayNextIcon />}
              color="primary"
              variant="contained"
              onClick={() => setOpenDialog(true)}
            >
              添加IP资源
      </Button>
      <br/>
      <br/>
      <Card
        {...rest}
        className={clsx(classes.root, className)}
      >
        <CardContent className={classes.content}>
          <Table
            data={data}
            columns={[
              {
                label: '资源标识',
                key: 'sourceKey'
              }, {
                label: '流量比例',
                key: 'ratio'
              },
              {
                label: '创建时间',
                key: 'createTime'
              }, {
                label: '操作',
                render: (item) => (
                  <>
                    <Button
                      startIcon={<DeviceHubIcon style={{ fontSize: 16 }} />}
                      size="small"
                      color="primary"
                      className={classes.tableButton}
                      onClick={() => {
                          console.log(item);
                          setSourceKey(item.sourceKey);
                          setRatio(item.ratio);
                          setOpenDialog(true);
                       }}
                      variant="contained">编辑</Button>
                    <Button
                      startIcon={<DeleteForeverIcon style={{ fontSize: 16 }} />}
                      size="small"
                      color="secondary"
                      className={classes.tableButton}
                      onClick={() => doDelete(item.id)}
                      variant="contained">删除</Button>
                  </>
                )
              }
            ]}
          />
        </CardContent>
        <CardActions className={classes.actions}>
          <Pagination
            count={Math.ceil(total / rowsPerPage) || 1}
            page={page}
            onChange={handlePageChange}
            shape="rounded" />
        </CardActions>
      </Card>

    </div>


  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DataTable;
