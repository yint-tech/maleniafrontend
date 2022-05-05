import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Select,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Typography,
  MenuItem,
  Divider,
  Grid,
  Tooltip,
  Switch
} from '@material-ui/core';

import apis from 'apis';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(4)
  },
  inputItem: {
    width: '100%'
  },
  actions: {
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
  btns: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  noMaxWidth: {
    maxWidth: 'none',
  },
}));

const demo = {
  "items": [
    {
      "param": "country",
      "nullable": true,
      "description": "国家参数",
      "enums": [
        "us", "uk", "cn", "*"
      ]
    },
    {
      "param": "zone",
      "nullable": true,
      "description": "隧道",
      "enums": [
        "zone1", "zone2"
      ]
    },
    {
      "param": "session",
      "nullable": true,
      "description": "会话标记，可以是任意随机字符串",
      "enums": [

      ]
    }
  ]
};

const Form = () => {

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const params = useParams();

  const classes = useStyles();
  const [form, setForm] = useState(() => {
    return {
      productName: '',
      description: '',
      loadProcessor: '',
      loadUrl: '',
      authUserNameExpression: '',
      mappingPortSpace: '',
      tuningParam: '',
      enabled: false,
      privateProduct: false,
      upstreamUserName: '',
      upstreamUserPassword: '',
      hourPrice: '',
      flowPrice: '',
      balanceUser: '',
      features: '',
    }
  });
  const [user, setUser] = useState([]);

  useEffect(() => {
    apis.listAllProducts({ page: 1, pageSize: 1000 }).then(res => {
      if (res.status === 0) {
        let editProduct = res.data.find(item => item.productId === params.id);
        if (editProduct) {
          for (let i in editProduct) {
            editProduct[i] = editProduct[i] || '';
          }
          if (editProduct.tuningParam) {
            try {
              editProduct.tuningParam = JSON.stringify(editProduct.tuningParam, undefined, 4);
            } catch (e) { }
          }
          delete editProduct.ipSourceList;
          delete editProduct.ipSource;
          setForm({ ...editProduct })
        }
      }
    }).catch(e => console.log(e));
  }, [params.id]);

  useEffect(() => {
    apis.userList({ page: 1, pageSize: 1000 }).then(res => {
      if (res.status === 0) {
        setUser(res.data.records);
      }
    }).catch(e => console.log(e));
  }, []);

  const doSave = () => {
    let tuningParam = '';
    try {
      if (form.tuningParam) {
        tuningParam = JSON.parse(form.tuningParam);
      }
    } catch (e) {
      enqueueSnackbar('隧道路由参数格式有误', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
      return;
    }
    apis.addOrUpdate({ ...form, tuningParam }).then(res => {
      if (res.status === 0) {
        enqueueSnackbar('保存产品成功', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
        history.go(-1);
      } else {
        enqueueSnackbar(res.errorMessage || res.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      }
    }).catch(e => console.log(e));
  }

  return (
    <Card className={classes.root}>
      <CardHeader title={!form.id ? '新增产品' : '编辑产品'}></CardHeader>
      <Divider />
      <CardContent>
        <Grid container spacing={6} wrap="wrap" >
          <Grid item xs={6} >
            <Typography
              gutterBottom
              variant="h6"
            >产品名称</Typography>
            <TextField
              className={classes.inputItem}
              size="small"
              variant="outlined"
              placeholder="请填写产品名称"
              value={form.productName}
              onChange={(e) => setForm({
                ...form,
                productName: e.target.value
              })} />
          </Grid>
          <Grid item xs={6} >
            <Typography
              gutterBottom
              variant="h6"
            >产品描述</Typography>
            <TextField
              className={classes.inputItem}
              size="small"
              variant="outlined"
              placeholder="请填写产品描述"
              value={form.description}
              onChange={(e) => setForm({
                ...form,
                description: e.target.value
              })} />
          </Grid>

          <Grid item xs={6} >
            <Typography gutterBottom variant="h6">是否启用</Typography>
            <Switch color="primary" checked={form.enabled} onChange={(e) => setForm(
              { ...form, enabled: e.target.checked })} />
          </Grid>
          <Grid item xs={4} >
            <Typography gutterBottom variant="h6">私有产品？</Typography>
            <Switch color="primary" checked={form.privateProduct} onChange={(e) => setForm(
              { ...form, privateProduct: e.target.checked })} />
          </Grid>

          <Grid item xs={12} >
            <Typography
              gutterBottom
              variant="h6"
            >产品特征标签</Typography>
            <TextField
              className={classes.inputItem}
              size="small"
              variant="outlined"
              placeholder="请输入产品特征标签，eg. "
              value={form.features}
              onChange={(e) => setForm({
                ...form,
                features: e.target.value
              })} />
          </Grid>
          <Grid item xs={6} >
            <Typography
              gutterBottom
              variant="h6"
            >使用价格，按小时付费</Typography>
            <TextField
              className={classes.inputItem}
              size="small"
              variant="outlined"
              placeholder="请输入按小时付费价格，eg. 10.2"
              value={form.hourPrice}
              onChange={(e) => setForm({
                ...form,
                hourPrice: e.target.value
              })} />
          </Grid>
          <Grid item xs={6} >
            <Typography
              gutterBottom
              variant="h6"
            >使用价格，按流量付费(0.01G)</Typography>
            <TextField
              className={classes.inputItem}
              size="small"
              variant="outlined"
              placeholder="请输入按流量付费价格，eg. 10.2"
              value={form.flowPrice}
              onChange={(e) => setForm({
                ...form,
                flowPrice: e.target.value
              })} />
          </Grid>
          <Grid item xs={12} >
            <Typography
              gutterBottom
              variant="h6"
            >端口范围</Typography>
            <TextField
              className={classes.inputItem}
              size="small"
              variant="outlined"
              placeholder="请输入端口范围，eg. 8000-9000,9001,9002"
              value={form.mappingPortSpace}
              onChange={(e) => setForm({
                ...form,
                mappingPortSpace: e.target.value
              })} />
          </Grid>
          <Grid item xs={12} >
            <Typography
              gutterBottom
              variant="h6"
            >隧道路由参数(需要上游支持)</Typography>
            <Tooltip placement="right" title={(
              <pre>
                {`${JSON.stringify(demo, undefined, 4)}`}
              </pre>
            )} classes={{ tooltip: classes.noMaxWidth }} interactive>
              <code>eg.</code>
            </Tooltip>
            <TextField
              className={classes.inputItem}
              size="small"
              variant="outlined"
              multiline
              rows={20}
              placeholder={`请输入隧道路由参数 eg. \n ${JSON.stringify(demo, undefined, 4)}`}
              value={form.tuningParam}
              onChange={(e) => setForm({
                ...form,
                tuningParam: e.target.value
              })} />
          </Grid>
          <Grid item xs={6} >
            <Typography
              gutterBottom
              variant="h6"
            >结算用户，默认为创建者</Typography>
            <Select
              className={classes.inputItem}
              style={{ height: '40px', overflow: 'hidden' }}
              variant="outlined"
              value={form.balanceUser}
              onChange={(e) => setForm({
                ...form,
                balanceUser: e.target.value
              })}
            >
              {user.map(item => (
                <MenuItem key={item.userName} value={item.userName}>
                  {item.userName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button className={classes.btns} variant="contained" color="default" onClick={() => history.go(-1)}>退出</Button>
        <Button className={classes.btns} variant="contained" color="primary" onClick={doSave}>保存</Button>
      </CardActions>
    </Card>
  );
};

export default Form;
