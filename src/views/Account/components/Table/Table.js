import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import DirectionsRailwayIcon from '@material-ui/icons/DirectionsRailway';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
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
    setPage(Number(page));
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
  };

  const grantAdmin = (item) => {
    apis.grantAdmin({
      userName: item.userName,
      isAdmin: !item.isAdmin,
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
        setRefresh(+new Date());
      }
    });
  };

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
              label: '??????',
              key: 'userName'
            }, {
              label: '??????',
              key: 'passwd'
            }, {
              label: '?????????',
              render: (item) => (
                item.isAdmin ? (<p>???</p>) : (<p>???</p>)
              )
            }
            , {
              label: '??????',
              key: 'balance'
            }, {
              label: '?????????',
              key: 'actualPayAmount'
            }, {
              label: '??????',
              render: (item) => (
                <>
                  <Button
                    startIcon={<AttachMoneyIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => { setEdit(item); setOpenDialog(true) }}
                    variant="contained">??????</Button>
                  <Button
                    startIcon={<DirectionsRailwayIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => doLogin(item)}
                    variant="contained">??????</Button>
                  <Button
                    startIcon={<SupervisorAccountIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => grantAdmin(item)}
                    variant="contained">{item.isAdmin ? "???????????????" : "???????????????"}</Button>
                  <Button
                    startIcon={<AddShoppingCartIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => { setProductId(""); showProductDialog(item.userName, setOpenAddProductDialog); }}
                    variant="contained">????????????</Button>
                  <Button
                    startIcon={<RemoveShoppingCartIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => { setProductId(""); showProductDialog(item.userName, setOpenRemoveProductDialog); }}
                    variant="contained">????????????</Button>
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
              handlePageChange(null, max)
            } else if (e.target.value < 1) {
              handlePageChange(null, 1)
            } else {
              handlePageChange(null, e.target.value)
            }
          }}
        />
      </CardActions>
      <OpeDialog
        title="????????????"
        opeContent={(
          <>
            <Typography variant="h6" >
              ????????????
            </Typography>
            <TextField
              className={classes.dialogInput}
              size="small"
              variant="outlined"
              type="number"
              placeholder="?????????????????????"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setActualAmount(e.target.value);
              }} />
            <Typography variant="h6" style={{ marginTop: 10 }} >
              ??????????????????
            </Typography>
            <TextField
              className={classes.dialogInput}
              size="small"
              variant="outlined"
              type="number"
              placeholder="???????????????????????????"
              value={actualAmount}
              onChange={(e) => setActualAmount(e.target.value)} />
            <Typography variant="h6" style={{ marginTop: 10 }} >
              ????????????
            </Typography>
            <TextField
              className={classes.dialogInput}
              size="small"
              variant="outlined"
              placeholder="???????????????"
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
              return '????????????';
            }
            throw new Error(res.message);
          });
        }}
        okText="??????"
        okType="primary" />
      <OpeDialog
        title="??????????????????"
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
                  <pre>{item.productName}</pre> {item.bought ? (<><pre>???????????????</pre></>) : null}
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
              return '????????????';
            }
            throw new Error(res.message);
          });
        }}
        okText="??????"
        okType="primary" />

      <OpeDialog
        title="??????????????????"
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
                  <pre>{item.productName}</pre> {item.bought ? (<><pre>???????????????</pre></>) : null}
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
              return '????????????';
            }
            throw new Error(res.message);
          });
        }}
        okText="??????"
        okType="primary" />
    </Card>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DataTable;
