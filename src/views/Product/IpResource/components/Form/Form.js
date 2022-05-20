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
  RadioGroup,
  Radio,
  FormControl,
  FormControlLabel,
  Divider,
  Grid,
  Switch,
  Tooltip
} from '@material-ui/core';

import apis from 'apis';

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

function InputItem({ col = 6, label = '', placeholder = '', value, onChange }) {
  const classes = useStyles();
  return (
    <Grid item xs={col} >
      <Typography
        gutterBottom
        variant="h6"
      >{label}</Typography>
      <TextField
        className={classes.inputItem}
        size="small"
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e)} />
    </Grid>
  )
}

const Form = () => {

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const params = useParams();

  const classes = useStyles();
  const [form, setForm] = useState(() => {
    return {
      sourceKey: '',
      description: '',
      loadProcessor: 'IpPortPlain',
      loadUrl: '',
      authUserNameExpression: '',
      upstreamUserName: '',
      upstreamUserPassword: '',
      poolSize: 10,
      connectionIdleSeconds: '20',
      enabled: true,
      makeConnCacheInterval: '20',
      maxAlive: '300',
      needTest: false,
      reloadInterval: '240',
      statusTestExp: '60<35|20<70|20<80',
      supportProtocol: 'HTTP,HTTPS',
      tuningParam: '',
    }
  });
  const [loadProcessor, setLoadProcessors] = useState([]);
  const [loadUrlType, setLoadUrlType] = useState('动态');

  useEffect(() => {
    apis.listAllIpResources({ page: 1, pageSize: 1000 }).then(res => {
      if (res.status === 0) {
        let pp = res.data.find(item => item.id.toString() === params.id);
        if (pp) {
          for (let i in pp) {
            pp[i] = pp[i] || '';
          }
          if (pp.loadUrl.indexOf('echo://') === 0) {
            setLoadUrlType('静态');
            pp.loadUrl = pp.loadUrl.replace('echo://', '');
          }
          if (pp.tuningParam) {
            try {
              pp.tuningParam = JSON.stringify(pp.tuningParam, undefined, 4);
            } catch (e) { }
          }
          setForm({ ...pp })
        }
      }
    }).catch(e => console.log(e));
  }, [params.id]);

  useEffect(() => {
    apis.listSupportProcessor().then(res => {
      if (res.status === 0) {
        setLoadProcessors(res.data);
      }
    });
  }, []);

  const doSave = () => {
    if (loadUrlType === '动态') {
      if (!form.loadUrl.startsWith('http')) {
        enqueueSnackbar('资源下载 URL 格式有误，必须以 http:// 或 https:// 开头', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
        return;
      }
    }
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
    apis.addOrUpdateIpResource({ ...form, loadUrl: (loadUrlType === '静态' ? 'echo://' : '') + form.loadUrl, tuningParam }).then(res => {
      if (res.status === 0) {
        enqueueSnackbar('保存Ip资源成功', {
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
      <CardHeader title="新增IP资源"></CardHeader>
      <Divider />
      <CardContent>
        <Grid container spacing={6} wrap="wrap" >
          <InputItem
            label="资源ID"
            placeholder="请填写资源唯一标识（建议字母下划线）"
            value={form.sourceKey}
            onChange={(e) => setForm({
              ...form,
              sourceKey: e.target.value
            })} />
          <InputItem
            col={3}
            label="资源描述"
            placeholder="请填写资源描述"
            value={form.description}
            onChange={(e) => setForm({
              ...form,
              description: e.target.value
            })} />
          <InputItem
            col={3}
            label="资源池大小"
            placeholder="数字"
            value={form.poolSize}
            onChange={(e) => setForm({
              ...form,
              poolSize: e.target.value
            })} />
          <Grid item xs={12} >
            <Typography
              gutterBottom
              variant="h6"
            >资源解析处理模版</Typography>
            <Select
              className={classes.inputItem}
              variant="outlined"
              value={form.loadProcessor}
              onChange={(e) => setForm({
                ...form,
                loadProcessor: e.target.value
              })}
            >
              {loadProcessor.map(item => (
                <MenuItem key={item.id} value={item.id}>
                  <pre>{item.id}：{item.desc}<br />Demo 展示.：<br />{item.demo}</pre>
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} >
            <FormControl component="fieldset" >
              <Typography
                gutterBottom
                variant="h6"
              >资源下载 URL</Typography>
              <RadioGroup row value={loadUrlType} onChange={(e) => setLoadUrlType(e.target.value)}>
                <FormControlLabel value="动态" control={<Radio />} label="动态" />
                <FormControlLabel value="静态" control={<Radio />} label="静态" />
              </RadioGroup>
            </FormControl>
            {loadUrlType === '动态' ? (
              <TextField
                className={classes.inputItem}
                size="small"
                variant="outlined"
                placeholder="请输入动态 url，eg. http://some-user.v4.dailiyun.com/query.txt?key=xxx&word=&count=200&rand=true&detail=false"
                value={form.loadUrl}
                onChange={(e) => setForm({
                  ...form,
                  loadUrl: e.target.value
                })} />
            ) : (
              <TextField
                className={classes.inputItem}
                size="small"
                variant="outlined"
                // InputProps={{
                //     startAdornment: <InputAdornment position="start">echo://</InputAdornment>,
                // }}
                placeholder="请输入静态 url，eg. zproxy.lum-superproxy.io:22225"
                value={form.loadUrl}
                onChange={(e) => setForm({
                  ...form,
                  loadUrl: e.target.value
                })} />
            )
            }
          </Grid>
          <InputItem
            col={12}
            label="鉴权账户表达式"
            placeholder="请输入表达式，eg. "
            value={form.authUserNameExpression}
            onChange={(e) => setForm({
              ...form,
              authUserNameExpression: e.target.value
            })} />
          <InputItem
            label="上游代理鉴权账户"
            placeholder="请输入上游代理鉴权账户，eg. "
            value={form.upstreamUserName}
            onChange={(e) => setForm({
              ...form,
              upstreamUserName: e.target.value
            })} />
          <InputItem
            label="上游代理鉴权密码"
            placeholder="请输入上游代理鉴权密码，eg. "
            value={form.upstreamUserPassword}
            onChange={(e) => setForm({
              ...form,
              upstreamUserPassword: e.target.value
            })} />
          <Grid item xs={6} >
            <Typography
              gutterBottom
              variant="h6"
            >当前资源是否生效</Typography>
            <Switch
              checked={form.enabled}
              onChange={(e) => setForm({
                ...form,
                enabled: e.target.checked
              })}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </Grid>
          <Grid item xs={6} >
            <Typography
              gutterBottom
              variant="h6"
            >是否需要探测可用性</Typography>
            <Switch
              checked={form.needTest}
              onChange={(e) => setForm({
                ...form,
                needTest: e.target.checked
              })}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </Grid>
          <InputItem
            label="连接池连接空转时间（秒）"
            placeholder="请输入连接池连接空转时间（秒）"
            value={form.connectionIdleSeconds}
            onChange={(e) => setForm({
              ...form,
              connectionIdleSeconds: e.target.value
            })} />
          <InputItem
            label="链接缓存池检查和创建时间间隔（秒）"
            placeholder="请输入链接缓存池检查和创建时间间隔（秒）"
            value={form.makeConnCacheInterval}
            onChange={(e) => setForm({
              ...form,
              makeConnCacheInterval: e.target.value
            })} />
          <InputItem
            col={12}
            label="资源质量评估表达式"
            placeholder="资源质量评估表达式"
            value={form.statusTestExp}
            onChange={(e) => setForm({
              ...form,
              statusTestExp: e.target.value
            })} />
          <InputItem
            label="IP下载时间间隔（秒）"
            placeholder="请输入IP下载时间间隔（秒）"
            value={form.reloadInterval}
            onChange={(e) => setForm({
              ...form,
              reloadInterval: e.target.value
            })} />
          <InputItem
            label="IP源支持协议(,分割)"
            placeholder="HTTP,HTTPS,SOCKS5"
            value={form.supportProtocol}
            onChange={(e) => setForm({
              ...form,
              supportProtocol: e.target.value
            })} />
          <InputItem
            label="最长存活时间（秒）"
            placeholder="请输入最长存活时间（秒）"
            value={form.maxAlive}
            onChange={(e) => setForm({
              ...form,
              maxAlive: e.target.value
            })} />
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
