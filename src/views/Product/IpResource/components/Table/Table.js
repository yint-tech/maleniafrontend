import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Table } from 'views/common';
import { useSnackbar } from 'notistack';
import { OpeDialog } from 'components';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
import { AppContext } from 'adapter';

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
  mt: {
    marginTop: theme.spacing(2)
  },
  inputItem: {
    width: '100%'
  }
}));

const DataTable = props => {
  const history = useHistory();
  const { user } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const { className, data, total, rowsPerPage, pageState, setRefresh, ...rest } = props;
  const [page, setPage] = pageState;

  const [openDialog, setOpenDialog] = useState(false);
  const [edit, setEdit] = useState({});
  const [stopDialog, setStopDialog] = useState({});

  const [balanceMethod, setBalanceMethod] = useState('METHOD_HOUR');
  const [referrer, setReferrer] = useState('');
  const [showReferrer, setShowReferrer] = useState(false);

  const classes = useStyles();

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleChange = (item) => {
    apis.updateStatus({ productId: item.productId, enabled: !item.enabled })
      .then(res => {
        if (res.status === 0) {
          enqueueSnackbar('操作成功', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
          setStopDialog({});
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
                <Typography gutterBottom variant="h6" >
                  资源名称：{item.sourceKey}
                </Typography>
                <Typography gutterBottom variant="h6" >
                  描述：{item.description}
                </Typography>
                {item.tuningParam && item.tuningParam.items && item.tuningParam.items.length && (
                  <>
                    <Typography gutterBottom variant="h6" >
                      隧道路由参数
                    </Typography>
                    <Table
                      style={{ height: 'auto', marginBottom: 10 }}
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
                )}
                {user.isAdmin && (
                  <>
                    <Typography gutterBottom variant="h6" >
                      鉴权表达式：{item.authUserNameExpression}
                    </Typography>
                    <Typography gutterBottom variant="h6" >
                      处理模版：{item.loadProcessor}
                    </Typography>
                    <Typography gutterBottom variant="h6" >
                      代理URL：{item.loadUrl.replace('echo://', '')}
                    </Typography>
                    <Typography gutterBottom variant="h6" >
                      上游代理鉴权账户：{item.upstreamUserName}
                    </Typography>
                    <Typography gutterBottom variant="h6" >
                      上游代理鉴权密码：{item.upstreamUserPassword}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          )}
          data={data}
          columns={[
            {
              label: '资源名称',
              key: 'sourceKey'
            }, {
              label: '描述',
              key: 'description'
            },
            {
              label: '资源池大小',
              key: 'poolSize'
            },
            {
              label: '处理模板',
              key: 'loadProcessor'
            }, {
              label: '操作',
              render: (item) => (
                <>
                  {user.isAdmin ? (
                    <>
                      <Button
                        startIcon={<DeviceHubIcon style={{ fontSize: 16 }} />}
                        size="small"
                        color="primary"
                        className={classes.tableButton}
                        onClick={() => history.push('/ipResourceEdit/' + item.id)}
                        variant="contained">编辑</Button>
                    </>
                  ) : null}
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
        title="确认选购产品"
        opeContent={(
          <>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12} >
                <Typography gutterBottom variant="h6" >
                  产品名：{edit.productName}
                </Typography>
                <Divider />
                <Typography className={classes.mt} variant="h6" >
                  计费方式
                </Typography>
                <FormControl component="fieldset" >
                  <RadioGroup row value={balanceMethod} onChange={(e) => setBalanceMethod(e.target.value)}>
                    <FormControlLabel value="METHOD_HOUR" control={<Radio />} label="按小时计费" />
                    <FormControlLabel value="METHOD_FLOW" control={<Radio />} label="按流量计费(G)" />
                  </RadioGroup>
                </FormControl>
                <Typography gutterBottom variant="h6" >
                  价格：{balanceMethod === 'METHOD_HOUR' ? edit.hourPrice : edit.flowPrice}
                </Typography>
                <Typography gutterBottom variant="h6" >
                  代理 url：{edit.loadUrl}
                </Typography>
                <Divider />
                <Grid container spacing={6} >
                  <Grid item xs={6} >
                    {showReferrer ? (
                      <>
                        <Typography gutterBottom className={classes.mt} variant="h6" >
                          推荐人
                        </Typography>
                        <TextField
                          className={classes.inputItem}
                          size="small"
                          variant="outlined"
                          placeholder="请输入推荐人"
                          value={referrer}
                          onChange={(e) => setReferrer(e.target.value)} />
                      </>
                    ) : (
                      <Button onClick={() => setShowReferrer(true)} color="primary">有推荐人?</Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return apis.purchase({
            productId: edit.productId,
            balanceMethod: balanceMethod,
            referrer: referrer
          }).then(res => {
            if (res.status === 0) {
              setRefresh(+new Date());
              setEdit({});
              setBalanceMethod('METHOD_HOUR');
              setOpenDialog(false);
              return '操作成功';
            }
            throw new Error(res.message);
          });
        }}
        okText="保存"
        okType="primary" />
      <Dialog onClose={() => setStopDialog({})} open={stopDialog.productId}>
        <DialogTitle style={{width: 400}}>确定停用该服务？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            产品名：{stopDialog.sourceKey}
          </DialogContentText>
          <DialogContentText>
            产品描述：{stopDialog.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStopDialog({})}>
            取消
          </Button>
          <Button onClick={() => {
            handleChange(stopDialog);
          }} color="secondary" autoFocus>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DataTable;
