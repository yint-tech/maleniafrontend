import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { useSnackbar } from "notistack";
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
  Switch,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import apis from "apis";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(4)
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    maxWidth: "300px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  desc: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  input: {
    display: "flex",
    alignItems: "center"
  },
  inputItem: {
    width: "100%"
  },
  inputBtn: {
    marginLeft: theme.spacing(2)
  },
  gutterTop: {
    marginTop: theme.spacing(2)
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  actions: {
    justifyContent: "center"
  },
  noMaxWidth: {
    maxWidth: "none"
  }
}));

function SingleInputItem({
                           placeholder = "",
                           initValue = "",
                           initKey = "",
                           type = "input",
                           options = [],
                           multiline = false,
                           reload = () => {
                           }
                         }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState("");
  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  const doSave = () => {
    apis.setConfig({ key: initKey, value }).then(res => {
      if (res.status === 0) {
        enqueueSnackbar("修改成功", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      } else {
        enqueueSnackbar(res.errorMessage || res.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      }
      reload();
    }).catch(e => console.log(e));
  };

  return (
    <Grid item xs={12} className={classes.input}>
      {
        type === "input" ? (
          <TextField
            className={classes.inputItem}
            multiline={multiline}
            rows={multiline ? 4 : undefined}
            size="small"
            variant="outlined"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}/>
        ) : null
      }
      {
        type === "switch" ? (
          <Switch
            checked={value || false}
            onChange={(e) => setValue(e.target.checked)}
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        ) : null
      }
      {
        type === "select" ? (
          <Select
            className={classes.inputItem}
            variant="outlined"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            {options.map(item => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        ) : null
      }
      <Button className={classes.inputBtn} variant="contained" color="primary" onClick={doSave}>保存</Button>
    </Grid>
  );
}

function OssSelectItem({
                         config = "",
                         datas = {},
                         aliyun = [],
                         s3 = [],
                         reload = () => {
                         }
                       }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState("");
  const [aliyunValue, setAliyunValue] = useState({});
  const [s3Value, setS3Value] = useState({});
  useEffect(() => {
    setValue(datas[config]);
    setAliyunValue(aliyun.reduce((a, b) => {
      a[b] = datas[b];
      return a;
    }, {}));
    setS3Value(s3.reduce((a, b) => {
      a[b] = datas[b];
      return a;
    }, {}));
  }, [datas, config, aliyun, s3]);

  const doSave = () => {
    let req = {
      [config]: value
    };
    if (value === "aliyunOss") {
      req = {
        ...req,
        ...aliyunValue
      };
    }
    if (value === "AmazonS3") {
      req = {
        ...req,
        ...s3Value
      };
    }
    apis.setConfigs(req).then(res => {
      if (res.status === 0) {
        enqueueSnackbar("修改成功", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      } else {
        enqueueSnackbar(res.errorMessage || res.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      }
      reload();
    }).catch(e => console.log(e));
  };

  return (
    <Grid item xs={12}>
      <Select
        className={classes.inputItem}
        variant="outlined"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {["local", "aliyunOss", "AmazonS3"].map(item => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
      {
        value === "aliyunOss" ? (
          <Grid className={classes.gutterTop} container spacing={6} wrap="wrap">
            {aliyun.map((item) => (
              <Grid item xs={6}>
                <Typography
                  gutterBottom
                  variant="h6"
                >{item}</Typography>
                <TextField
                  className={classes.inputItem}
                  size="small"
                  variant="outlined"
                  value={aliyunValue[item]}
                  onChange={(e) => {
                    setAliyunValue({
                      ...aliyunValue,
                      [item]: e.target.value
                    });
                  }}/>
              </Grid>
            ))}
          </Grid>
        ) : null}
      {
        value === "AmazonS3" ? (
          <Grid className={classes.gutterTop} container spacing={6} wrap="wrap">
            {s3.map((item) => (
              <Grid item xs={6}>
                <Typography
                  gutterBottom
                  variant="h6"
                >{item}</Typography>
                <TextField
                  className={classes.inputItem}
                  size="small"
                  variant="outlined"
                  value={s3Value[item]}
                  onChange={(e) => {
                    setS3Value({
                      ...s3Value,
                      [item]: e.target.value
                    });
                  }}/>
              </Grid>
            ))}
          </Grid>
        ) : null}
      <Button className={classes.gutterTop} variant="contained" color="primary" onClick={doSave}>保存</Button>
    </Grid>
  );
}

const Form = () => {

  const classes = useStyles();
  const [configs, setConfigs] = useState({});

  const [refresh, setRefresh] = useState(+new Date());

  const CONFIGS = [
    {
      key: "malenia.global.maxWhiteIpPerUser",
      name: "每个用户最大的白名单数量",
      desc: "数字，建议100",
      component: (
        <SingleInputItem
          placeholder="建议100"
          initKey="malenia.global.maxWhiteIpPerUser"
          initValue={configs["malenia.global.maxWhiteIpPerUser"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.bill.minutes",
      name: "对账时间间隔",
      desc: "主要针对于按量付费用户的实时扣费。数字，建议5",
      component: (
        <SingleInputItem
          placeholder="建议5"
          initKey="malenia.bill.minutes"
          initValue={configs["malenia.bill.minutes"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.alert.urlTemplate",
      name: "系统敏感事件通知WEBHOOK",
      desc: "包括他判定的报警事件、敏感API操作等。可以将这些数据接入到微信、钉钉等运维群聊中",
      component: (
        <SingleInputItem
          placeholder="一个URL，建议一整行"
          initKey="malenia.alert.urlTemplate"
          initValue={configs["malenia.alert.urlTemplate"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.access_record",
      name: "是否记录用户访问日志",
      desc: "bool，是否记录用户访问日志",
      component: (
        <SingleInputItem
          type="switch"
          initKey="malenia.access_record"
          initValue={configs["malenia.access_record"] === "true"}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.proxyTestUrl",
      name: "代理IP资源探测URL",
      desc: "一个URL",
      component: (
        <SingleInputItem
          placeholder="一个URL"
          initKey="malenia.proxyTestUrl"
          initValue={configs["malenia.proxyTestUrl"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.listenType",
      name: "代理服务监听类型",
      desc: "主要作用是区别内外网，一般建议直接all。枚举：lo,private,public,all",
      component: (
        <SingleInputItem
          type="select"
          initKey="malenia.listenType"
          initValue={configs["malenia.listenType"]}
          options={["all", "lo", "private", "public"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.loadProcessorGroovyExtension",
      name: "扩展IP解析器",
      desc: "使用 groovy 定义 extension。Demo 见文档（管理员操作文档 -> 定义IP源 -> 使用脚本定义解析模版）",
      component: (
        <SingleInputItem
          placeholder="extension"
          multiline
          initKey="malenia.loadProcessorGroovyExtension"
          initValue={configs["malenia.loadProcessorGroovyExtension"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.defaultBandwidthLimit",
      name: "默认带宽限制",
      desc: "用户带宽付费模式下，默认带宽限制。数字，单位M，建议3",
      component: (
        <SingleInputItem
          placeholder="建议3"
          initKey="malenia.defaultBandwidthLimit"
          initValue={configs["malenia.defaultBandwidthLimit"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.systemNotice",
      name: "系统通告信息",
      desc: "系统通告信息",
      component: (
        <SingleInputItem
          placeholder="系统通告信息"
          initKey="malenia.systemNotice"
          initValue={configs["malenia.systemNotice"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.serverURLBase",
      name: "系统运行服务器的服务地址",
      desc: "系统会尝试自动生成，也可以被用户直接指定。http://malenia.iinti.cn",
      component: (
        <SingleInputItem
          placeholder="服务器的服务地址"
          initKey="malenia.serverURLBase"
          initValue={configs["malenia.serverURLBase"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.storage.cacheFileSize",
      name: "本地默认缓存",
      desc: "默认500个文件，超过之后将会移除没有访问的资源",
      component: (
        <SingleInputItem
          placeholder="默认500个文件"
          initKey="malenia.storage.cacheFileSize"
          initValue={configs["malenia.storage.cacheFileSize"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.storage.active",
      name: "当前文件存储方案",
      desc: "枚举：aliyunOss,local,AmazonS3",
      component: (
        <OssSelectItem
          datas={configs}
          config={"malenia.storage.active"}
          aliyun={[
            "malenia.storage.aliyun.endpoint",
            "malenia.storage.aliyun.accessKey",
            "malenia.storage.aliyun.secretKey",
            "malenia.storage.aliyun.bucketName"
          ]}
          s3={[
            "malenia.storage.s3.region",
            "malenia.storage.s3.accessKey",
            "malenia.storage.s3.secretKey",
            "malenia.storage.s3.bucketName"
          ]}
          reload={() => setRefresh(+new Date())}/>
      )
    }
  ];

  useEffect(() => {
    apis.allConfig().then(res => {
      if (res.status === 0) {
        setConfigs(res.data.reduce((a, b) => {
          a[b.configKey] = b.configValue;
          return a;
        }, {}));
      }
    }).catch(e => console.log(e));
  }, [refresh]);

  return (
    <Card className={classes.root}>
      <CardHeader title="系统设置" action={(
        <CardActions className={classes.actions}>
          {/* <Button variant="contained" color="primary" onClick={doSave}>保存</Button> */}
        </CardActions>
      )}></CardHeader>
      <Divider/>
      <CardContent>
        {CONFIGS.map((item, index) => (
          <Accordion key={"panel" + index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography className={classes.heading}>{item.name}</Typography>
              <Typography className={classes.secondaryHeading}>{configs[item.key]}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: "100%" }}>
                <Typography className={classes.desc}>填写说明：{item.desc}</Typography>
                <Divider className={classes.divider}/>
                <Grid container spacing={6} wrap="wrap">
                  {item.component}
                </Grid>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );
};

export default Form;
