import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import EditIcon from '@material-ui/icons/Edit';
import { AppContext } from 'adapter';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/styles';
import { Table } from 'views/common';
import { OpeDialog } from 'components';
import { Link } from 'react-router-dom';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Grid,
  Switch,
  TextField
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

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
  dialogInput: {
    width: '100%'
  },
  mt: {
    marginTop: theme.spacing(1)
  }
}));

const DataTable = props => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AppContext);
  const { className, data, total, rowsPerPage, pageState, setRefresh, ...rest } = props;
  const [page, setPage] = pageState;

  const [openDialog, setOpenDialog] = useState(false);
  const [openChange, setOpenChange] = useState(false);
  const [price, setPrice] = useState('');
  const [bandwidth, setBandwidth] = useState('');

  const [edit, setEdit] = useState({});
  const [balanceMethod, setBalanceMethod] = useState('');

  const classes = useStyles();

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleChange = (item) => {
    apis.purchaseUpdateStatus({ productId: item.productId, enabled: !item.enabled })
      .then(res => {
        if (res.status === 0) {
          enqueueSnackbar('操作成功', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
          setRefresh(+new Date());
        } else {
          enqueueSnackbar(res.message, {
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
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <Table
          collapse={true}
          renderCollapse={(item) => (
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12} >
                {!user.authAccount ? (
                  <Alert severity="warning">
                    <AlertTitle>紧急！！！</AlertTitle>
                    建议先设置代理账号密码，代理账密和后台账密相同容易导致您的接入密码被硬编码到代码中从而泄漏后台账户 <Link to="/dashboard"><strong>去设置</strong></Link>
                  </Alert>
                ) : (
                  <>
                    <Typography gutterBottom variant="subtitle2" >
                      代理链接使用如下 <a href="https://baike.baidu.com/item/curl/10098606?fr=aladdin" target="_blank" rel="noopener noreferrer">curl</a> . eg.
                    </Typography>
                    <code>
                      curl -x {user.authAccount}:{user.authPwd}@{window.location.hostname}:{item.mappingPortSpace && item.mappingPortSpace.split('-')[0]} https://www.baidu.com/
                    </code>
                    {(item.tuningParam && item.tuningParam.items && item.tuningParam.items.length) ? (
                      <>
                        <Typography gutterBottom variant="h6" style={{ marginTop: 10 }} >
                          隧道路由参数
                        </Typography>
                        <Table
                          style={{ height: 'auto' }}
                          size="small"
                          data={item.tuningParam.items}
                          columns={[{
                            label: '参数',
                            key: 'param'
                          }, {
                            label: '是否可为空',
                            render: (item) => item.nullable ? '是' : '否'
                          }, {
                            label: '描述',
                            key: 'description'
                          }, {
                            label: '参数值',
                            render: (item) => item.enums.join(',')
                          }]}
                        />
                      </>
                    ) : null}
                  </>
                )}
              </Grid>
            </Grid>
          )}
          data={data}
          columns={[
            {
              label: '产品名',
              key: 'productName'
            }, {
              label: '价格',
              key: 'balancePrice'
            }, {
              label: '带宽限制',
              render: (item) => {
                if (item.balanceMethod === 'METHOD_HOUR') {
                  return item.bandwidthLimit + 'm'
                }
                return '-';
              }
            }, {
              label: '代理端口',
              key: 'mappingPortSpace'
            }, {
              label: '计费方式',
              render: (item) => {
                return {
                  'METHOD_HOUR': '按小时',
                  'METHOD_FLOW': '按流量(0.01G)',
                }[item.balanceMethod]
              }
            }, {
              label: '操作',
              render: (item) => (
                <>
                  <Button
                    startIcon={<EditIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => { setEdit(item); setOpenDialog(true); setBalanceMethod(item.balanceMethod) }}
                    variant="contained">调整</Button>
                  {(user.mock && item.balanceMethod === 'METHOD_HOUR') ? (
                    <Button
                      startIcon={<EditIcon style={{ fontSize: 16 }} />}
                      size="small"
                      color="primary"
                      className={classes.tableButton}
                      onClick={() => { setEdit(item); setOpenChange(true); setPrice(item.balancePrice); setBandwidth(item.bandwidthLimit) }}
                      variant="contained">修改价格 | 带宽</Button>
                  ) : null}
                  <Switch
                    checked={item.enabled}
                    onChange={() => handleChange(item)}
                    color="primary"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
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
      <OpeDialog
        title="修改配置"
        opeContent={(
          <>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12} >
                <Typography className={classes.mt} variant="h6" >
                  计费方式
                </Typography>
                <FormControl component="fieldset" >
                  <RadioGroup row value={balanceMethod} onChange={(e) => setBalanceMethod(e.target.value)}>
                    <FormControlLabel value="METHOD_HOUR" control={<Radio />} label="按小时计费" />
                    <FormControlLabel value="METHOD_FLOW" control={<Radio />} label="按流量计费(0.01G)" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return apis.switchBalanceMethod({
            productId: edit.productId,
            balanceMethod: balanceMethod,
          }).then(res => {
            if (res.status === 0) {
              setRefresh(+new Date());
              setEdit({});
              return '操作成功';
            }
            throw new Error(res.message);
          });
        }}
        okText="保存"
        okType="primary" />
      <OpeDialog
        title="修改带宽 | 价格"
        opeContent={(
          <>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12} >
                <Typography variant="h6" >
                  价格
                </Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)} />
                <Typography className={classes.mt} variant="h6" >
                  带宽
                </Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  value={bandwidth}
                  onChange={(e) => setBandwidth(e.target.value)} />
              </Grid>
            </Grid>
          </>
        )}
        openDialog={openChange}
        setOpenDialog={setOpenChange}
        doDialog={() => {
          return apis.modifyOrderBandwidthLimit({
            orderId: edit.id,
            bandwidthLimit: bandwidth,
            newOrderPrice: price,
          }).then(res => {
            if (res.status === 0) {
              setRefresh(+new Date());
              setEdit({});
              return '操作成功';
            }
            throw new Error(res.message);
          });
        }}
        okText="保存"
        okType="primary" />
    </Card>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DataTable;
