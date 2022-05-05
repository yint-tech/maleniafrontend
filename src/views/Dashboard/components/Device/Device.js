import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Grid,
  Typography,
  Divider,
  IconButton,
  MenuItem,
  Select,
  Button,
  Popover
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { AppContext } from 'adapter';
import { useSnackbar } from 'notistack';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Table } from 'views/common';
import { MetricCharts } from 'components/MetricCharts';
import Pagination from '@material-ui/lab/Pagination';
import clsx from 'clsx';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CachedIcon from '@material-ui/icons/Cached';
import moment from 'moment';
import apis from 'apis';
import SetLoginPassword from './SetLoginPassword';
import SetProxyAccount from './setProxyAccount';

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
    backgroundColor: theme.palette.success.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  mt: {
    marginTop: theme.spacing(4)
  },
  mr: {
    marginRight: theme.spacing(6)
  },
  pd: {
    width: theme.spacing(18),
    paddingLeft: theme.spacing(1),
    textAlign: 'center',
  },
  url: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    lineHeight: '1.2em',
    wordBreak: 'break-all',
    cursor: 'pointer'
  },
  padding: {
    padding: theme.spacing(2)
  },
  formControl: {
    width: theme.spacing(20),
    margin: theme.spacing(2),
  },
  pop: {
    padding: theme.spacing(2)
  },
  popBtns: {
    marginTop: theme.spacing(2),
    textAlign: 'center'
  }
}));


const Budget = props => {
  const { className, ...rest } = props;
  const { user, setUser } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();

  const apiUrl = user.apiToken;

  const classes = useStyles();

  const [product, setProduct] = useState('all');
  const [products, setProducts] = useState([]);

  const [top10, setTop10] = useState([]);

  const [metricChartName, setMetricChartName] = useState('');
  const [metricChartTime, setMetricChartTime] = useState('minutes');
  const [metricNames, setMetricNames] = useState([]);
  useEffect(() => {
    apis.adminGetMetricNames().then(res => {
      if (res?.data) {
        setMetricNames(res.data);
        setMetricChartName(res.data[0]);
      }
    })
  }, []);

  useEffect(() => {
    apis.listAllOrders({ page: 1, pageSize: 1000 }).then(res => {
      if (res.status === 0) {
        setProducts([{ productId: 'all', productName: 'ALL' }, ...res.data]);
      }
    }).catch(e => console.log(e));
    apis.usageTopTen({ page: 1, pageSize: 1000 }).then(res => {
      if (res.status === 0) {
        setTop10([...res.data]);
      }
    }).catch(e => console.log(e));
  }, []);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pipeline, setPipeline] = useState([]);
  useEffect(() => {
    apis.billList({ page, pageSize: 10, productId: product === 'all' ? '' : product }).then(res => {
      if (res.status === 0) {
        setTotal(res.data.total);
        setPipeline(res.data.records);
      }
    }).catch(e => console.log(e));
  }, [page, product]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const doRefreshApiToken = () => {
    apis.regenerateAPIToken().then(res => {
      if (res.status === 0) {
        let user = apis.getStore();
        user.apiToken = res.data.apiToken;
        apis.setStore(user);
        setUser({
          ...user,
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        });
      }
    })
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title="API TOKEN" />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography
              className={classes.url}
              color="textSecondary"
              variant="caption"
            >
              {apiUrl}
              <CopyToClipboard text={apiUrl}
                onCopy={() => enqueueSnackbar("复制成功", {
                  variant: 'success',
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                  },
                }, 2)}>
                <IconButton style={{ marginLeft: 15 }} color="primary" aria-label="upload picture" component="span">
                  <FileCopyIcon />
                </IconButton>
              </CopyToClipboard>
              <IconButton
                onClick={handleClick}
                style={{ marginLeft: 15 }}
                color="primary"
                aria-label="upload picture"
                component="span">
                <CachedIcon />
              </IconButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className={classes.pop}>
                  <Alert severity="warning">
                    <AlertTitle>APIToken 刷新后，通过 API 访问 Malenia 后台的请求将会被阻断</AlertTitle>
                    如果 APIToken 没有泄漏，不建议重制 Token
                  </Alert>
                  <div className={classes.popBtns}>
                    <Button
                      onClick={handleClose}
                      color="primary"
                      aria-label="upload picture"
                      component="span">
                      取消
                    </Button>
                    <Button
                      onClick={() => {
                        doRefreshApiToken();
                        handleClose();
                      }}
                      style={{ marginLeft: 15 }}
                      color="primary"
                      aria-label="upload picture"
                      component="span">
                      确定
                    </Button>
                  </div>
                </div>
              </Popover>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <SetLoginPassword />
      <Divider />
      <SetProxyAccount />

      <Divider />
      <CardHeader title="指标数据" action={(
        <>
          <Select
            style={{ width: '200px', height: '40px', overflow: 'hidden' }}
            variant="outlined"
            value={metricChartTime}
            onChange={(e) => {
              setMetricChartTime(e.target.value);
            }}
          >
            {['minutes', 'hours', 'days'].map(d => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
          <Select
            style={{ width: '200px', height: '40px', overflow: 'hidden' }}
            variant="outlined"
            value={metricChartName}
            onChange={(e) => {
              setMetricChartName(e.target.value);
            }}
          >
            {metricNames.map(name => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </>
      )} />
      <Divider />
      <MetricCharts
        metricAccuracy={metricChartTime}
        name={metricChartName}
        poly={{}}
        height={'300px'} />
      <CardHeader title="订单流水" action={(
        <Select
          style={{ width: '200px', height: '40px', overflow: 'hidden' }}
          variant="outlined"
          value={product}
          onChange={(e) => {
            setProduct(e.target.value);
            setPage(1);
          }}
        >
          {products.map(item => (
            <MenuItem key={item.productName} value={item.productId}>
              {item.productName}
            </MenuItem>
          ))}
        </Select>
      )} />
      <Divider />
      <CardContent>
        <Table
          data={pipeline}
          columns={[
            {
              label: '产品名',
              key: 'productName'
            }, {
              label: '价格',
              key: 'consumeAmount'
            }, {
              label: '计费方式',
              render: (item) => {
                return {
                  'METHOD_HOUR': '按小时',
                  'METHOD_FLOW': '按流量(0.01G)',
                }[item.balanceMethod]
              }
            }, {
              label: '时间',
              key: 'reconciliationTime'
            }
          ]}
        />
      </CardContent>
      <CardActions className={classes.actions}>
        <Pagination
          count={Math.ceil(total / 10) || 1}
          page={page}
          onChange={(event, p) => setPage(p)}
          shape="rounded" />
      </CardActions>
      {user.isAdmin ? (
        <>
          <Divider />
          <CardHeader title="TOP10 带宽用户" />
          <Divider />
          <CardContent>
            <Table
              data={top10}
              columns={[
                {
                  label: '用户',
                  key: 'purchaseUser'
                }, {
                  label: '产品名',
                  key: 'productName'
                }, {
                  label: '用量',
                  key: 'productName',
                  render: (item) => {
                    return (item.rateUsage / 1024 / 1024).toFixed(2) + 'm'
                  }
                }
              ]}
            />
          </CardContent>
        </>
      ) : null}
    </Card >
  );
};

export default Budget;
