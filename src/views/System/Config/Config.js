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
        enqueueSnackbar("????????????", {
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
      <Button className={classes.inputBtn} variant="contained" color="primary" onClick={doSave}>??????</Button>
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
        enqueueSnackbar("????????????", {
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
      <Button className={classes.gutterTop} variant="contained" color="primary" onClick={doSave}>??????</Button>
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
      name: "????????????????????????????????????",
      desc: "???????????????100",
      component: (
        <SingleInputItem
          placeholder="??????100"
          initKey="malenia.global.maxWhiteIpPerUser"
          initValue={configs["malenia.global.maxWhiteIpPerUser"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.bill.minutes",
      name: "??????????????????",
      desc: "??????????????????????????????????????????????????????????????????5",
      component: (
        <SingleInputItem
          placeholder="??????5"
          initKey="malenia.bill.minutes"
          initValue={configs["malenia.bill.minutes"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.alert.urlTemplate",
      name: "????????????????????????WEBHOOK",
      desc: "???????????????????????????????????????API???????????????????????????????????????????????????????????????????????????",
      component: (
        <SingleInputItem
          placeholder="??????URL??????????????????"
          initKey="malenia.alert.urlTemplate"
          initValue={configs["malenia.alert.urlTemplate"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.access_record",
      name: "??????????????????????????????",
      desc: "bool?????????????????????????????????",
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
      name: "??????IP????????????URL",
      desc: "??????URL",
      component: (
        <SingleInputItem
          placeholder="??????URL"
          initKey="malenia.proxyTestUrl"
          initValue={configs["malenia.proxyTestUrl"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.listenType",
      name: "????????????????????????",
      desc: "???????????????????????????????????????????????????all????????????lo,private,public,all",
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
      name: "??????IP?????????",
      desc: "?????? groovy ?????? extension???Demo ????????????????????????????????? -> ??????IP??? -> ?????????????????????????????????",
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
      name: "??????????????????",
      desc: "??????????????????????????????????????????????????????????????????M?????????3",
      component: (
        <SingleInputItem
          placeholder="??????3"
          initKey="malenia.defaultBandwidthLimit"
          initValue={configs["malenia.defaultBandwidthLimit"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.systemNotice",
      name: "??????????????????",
      desc: "??????????????????",
      component: (
        <SingleInputItem
          placeholder="??????????????????"
          initKey="malenia.systemNotice"
          initValue={configs["malenia.systemNotice"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.docNotice",
      name: "????????????????????????",
      desc: "????????????????????????,????????????html????????????",
      component: (
        <SingleInputItem
          multiline
          placeholder="??????????????????"
          initKey="malenia.docNotice"
          initValue={configs["malenia.docNotice"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.serverURLBase",
      name: "????????????????????????????????????",
      desc: "???????????????????????????????????????????????????????????????http://malenia.iinti.cn",
      component: (
        <SingleInputItem
          placeholder="????????????????????????"
          initKey="malenia.serverURLBase"
          initValue={configs["malenia.serverURLBase"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.storage.cacheFileSize",
      name: "??????????????????",
      desc: "??????500?????????????????????????????????????????????????????????",
      component: (
        <SingleInputItem
          placeholder="??????500?????????"
          initKey="malenia.storage.cacheFileSize"
          initValue={configs["malenia.storage.cacheFileSize"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "malenia.storage.active",
      name: "????????????????????????",
      desc: "?????????aliyunOss,local,AmazonS3",
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
      <CardHeader title="????????????" action={(
        <CardActions className={classes.actions}>
          {/* <Button variant="contained" color="primary" onClick={doSave}>??????</Button> */}
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
                <Typography className={classes.desc}>???????????????{item.desc}</Typography>
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
