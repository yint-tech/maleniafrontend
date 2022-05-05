import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import DirectionsRailwayIcon from '@material-ui/icons/DirectionsRailway';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import { makeStyles } from '@material-ui/styles';
import { Table } from 'views/common';
import { useSnackbar } from 'notistack';
import { OpeDialog } from 'components';
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Input,
} from '@material-ui/core';
import { AppContext } from 'adapter';
import moment from 'moment';

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
  }
}));

const DataTable = props => {
  const { setUser } = useContext(AppContext);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { className, data, total, rowsPerPage, pageState, setRefresh, ...rest } = props;
  const [page, setPage] = pageState;

  const [openDialog, setOpenDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [actualAmount, setActualAmount] = useState('');
  const [rechargeComment, setRechargeComment] = useState('');
  const [edit, setEdit] = useState({});
  const [productId, setProductId] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
  const [openRemoveProductDialog, setOpenRemoveProductDialog] = useState(false);
  const products = props.products.filter(p => {
    return p.privateProduct && p.enabled;
  });

  const classes = useStyles();

  const handlePageChange = (event, page) => {
    setPage(page);
  };
  const showProductDialog = (userId, oepnAction) => {
    apis.getUserPrivateProductIds({ userId: userId })
      .then(res => {
        let productIds = res.data
        products.map(item => {
          item.bought = productIds && productIds.indexOf(item.productId) > 0;
          return item;
        });
        oepnAction(true);
        setCurrentUserId(userId);
      });
  }

  const doLogin = (item) => {
    apis.login({
      userName: item.userName,
      password: item.passwd,
    }).then(res => {
      if (res.status !== 0) {
        enqueueSnackbar(res.errorMessage || res.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      } else {
        apis.setStore({ ...res.data, mock: true }, "Malenia-USER-MOCK");
        setUser({
          ...res.data,
          mock: true,
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        });
        history.push('/');
      }
    });
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <Table
          data={data}
          columns={[
            {
              label: '账号',
              key: 'userName'
            }, {
              label: '密码',
              key: 'passwd'
            }, {
              label: '余额',
              key: 'balance'
            }, {
              label: '已充值',
              key: 'actualPayAmount'
            }, {
              label: '操作',
              render: (item) => (
                <>
                  <Button
                    startIcon={<AttachMoneyIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => { setEdit(item); setOpenDialog(true) }}
                    variant="contained">充值</Button>
                  <Button
                    startIcon={<DirectionsRailwayIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => doLogin(item)}
                    variant="contained">登录</Button>
                  <Button
                    startIcon={<AddShoppingCartIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => { setProductId(""); showProductDialog(item.userName, setOpenAddProductDialog); }}
                    variant="contained">关联产品</Button>
                  <Button
                    startIcon={<RemoveShoppingCartIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => { setProductId(""); showProductDialog(item.userName, setOpenRemoveProductDialog); }}
                    variant="contained">移除产品</Button>
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
        <Input
          type="number"
          max
          value={page}
          onChange={(e) => {
            let max = Math.ceil(total / rowsPerPage) || 1;
            if (e.target.value > max) {
              setPage(max)
            } else if (e.target.value < 1) {
              setPage(1)
            } else {
              setPage(e.target.value)
            }
          }}
        />
      </CardActions>
      <OpeDialog
        title="余额充值"
        opeContent={(
          <>
            <Typography variant="h6" >
              充值金额
            </Typography>
            <TextField
              className={classes.dialogInput}
              size="small"
              variant="outlined"
              type="number"
              placeholder="请输入充值金额"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setActualAmount(e.target.value);
              }} />
            <Typography variant="h6" style={{ marginTop: 10 }} >
              实际到账金额
            </Typography>
            <TextField
              className={classes.dialogInput}
              size="small"
              variant="outlined"
              type="number"
              placeholder="请输入实际到账金额"
              value={actualAmount}
              onChange={(e) => setActualAmount(e.target.value)} />
            <Typography variant="h6" style={{ marginTop: 10 }} >
              充值备注
            </Typography>
            <TextField
              className={classes.dialogInput}
              size="small"
              variant="outlined"
              placeholder="请输入备注"
              value={rechargeComment}
              onChange={(e) => setRechargeComment(e.target.value)} />
          </>
        )}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return apis.rechargeUser({
            user: edit.userName,
            amount: amount,
            actualPayAmount: actualAmount,
            rechargeComment: rechargeComment
          }).then(res => {
            if (res.status === 0) {
              setRefresh(+new Date());
              setEdit({});
              setOpenDialog(false);
              setAmount('');
              setActualAmount('');
              setRechargeComment('');
              return '操作成功';
            }
            throw new Error(res.message);
          });
        }}
        okText="保存"
        okType="primary" />

      <OpeDialog
        title="添加私有产品"
        opeContent={(
          <>
            <Select
              className={classes.dialogInput}
              size="small"
              variant="outlined"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              {products.map(item => (
                <MenuItem key={item.productId} value={item.productId}>
                  <pre>{item.productName}</pre> {item.bought ? (<><pre>（已拥有）</pre></>) : null}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
        openDialog={openAddProductDialog}
        setOpenDialog={setOpenAddProductDialog}
        doDialog={() => {
          return apis.savePrivateProductRelation({
            productId: productId,
            userName: currentUserId
          }).then(res => {
            if (res.status === 0) {
              setProductId("")
              setOpenAddProductDialog(false);
              return '添加成功';
            }
            throw new Error(res.message);
          });
        }}
        okText="保存"
        okType="primary" />

      <OpeDialog
        title="移除私有产品"
        opeContent={(
          <>
            <Select
              className={classes.dialogInput}
              size="small"
              variant="outlined"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              {products.map(item => (
                <MenuItem key={item.productId} value={item.productId}>
                  <pre>{item.productName}</pre> {item.bought ? (<><pre>（已拥有）</pre></>) : null}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
        openDialog={openRemoveProductDialog}
        setOpenDialog={setOpenRemoveProductDialog}
        doDialog={() => {
          return apis.removePrivateProductRelation({
            productId: productId,
            userId: currentUserId
          }).then(res => {
            if (res.status === 0) {
              setProductId("")
              setOpenRemoveProductDialog(false);
              return '移除成功';
            }
            throw new Error(res.message);
          });
        }}
        okText="移除"
        okType="primary" />



    </Card>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DataTable;
