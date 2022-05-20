import React, { useState, useContext } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import Pagination from "@material-ui/lab/Pagination";
import EditIcon from "@material-ui/icons/Edit";
import { AppContext } from "adapter";
import { makeStyles } from "@material-ui/styles";
import { Table } from "views/common";
import { OpeDialog } from "components";
import { Link } from "react-router-dom";
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
  TextField, Select, MenuItem
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import apis from "apis";

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  nameContainer: {
    display: "flex",
    alignItems: "center"
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    justifyContent: "center"
  },
  tableButton: {
    marginRight: theme.spacing(1)
  },
  dialogInput: {
    width: "100%"
  },
  mt: {
    marginTop: theme.spacing(1)
  }
}));

const DataTable = props => {
  const { user } = useContext(AppContext);
  const { className, data, total, rowsPerPage, pageState, setRefresh, ...rest } = props;
  const [page, setPage] = pageState;

  const [openDialog, setOpenDialog] = useState(false);
  const [openChange, setOpenChange] = useState(false);
  const [price, setPrice] = useState("");
  const [bandwidth, setBandwidth] = useState("");

  const [edit, setEdit] = useState({});
  const [form, setForm] = useState(() => {
    return {
      productId: "",
      enabled: true,
      randomTurning: false,
      balanceMethod: "",
      connectTimeout: "",
      maxFailoverCount: ""
    };
  });
  const classes = useStyles();

  const handlePageChange = (event, page) => {
    setPage(page);
  };


  const doEditOrder = (order) => {
    return apis.editUserOrder({
      productId: order.productId,
      enabled: order.enabled,
      randomTurning: order.randomTurning,
      balanceMethod: order.balanceMethod,
      connectTimeout: order.connectTimeout,
      maxFailoverCount: order.maxFailoverCount
    }).then(res => {
      setOpenDialog(false);
      if (res.status === 0) {
        setRefresh(+new Date());
        return "操作成功";
      }
      throw new Error(res.message);
    });
  };


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
              <Grid item xs={12}>
                {!user.authAccount ? (
                  <Alert severity="warning">
                    <AlertTitle>紧急！！！</AlertTitle>
                    建议先设置代理账号密码，代理账密和后台账密相同容易导致您的接入密码被硬编码到代码中从而泄漏后台账户 <Link to="/dashboard"><strong>去设置</strong></Link>
                  </Alert>
                ) : (
                  <>
                    <Typography gutterBottom variant="subtitle2">
                      代理链接使用如下 <a href="https://baike.baidu.com/item/curl/10098606?fr=aladdin" target="_blank"
                                  rel="noopener noreferrer">curl</a> . eg.
                    </Typography>
                    <code>
                      curl
                      -x {user.authAccount}:{user.authPwd}@{window.location.hostname}:{item.mappingPortSpace && item.mappingPortSpace.split("-")[0]} https://www.baidu.com/
                    </code>
                    {(item.tuningParam && item.tuningParam.items && item.tuningParam.items.length) ? (
                      <>
                        <Typography gutterBottom variant="h6" style={{ marginTop: 10 }}>
                          隧道路由参数
                        </Typography>
                        <Table
                          style={{ height: "auto" }}
                          size="small"
                          data={item.tuningParam.items}
                          columns={[{
                            label: "参数",
                            key: "param"
                          }, {
                            label: "是否可为空",
                            render: (item) => item.nullable ? "是" : "否"
                          }, {
                            label: "描述",
                            key: "description"
                          }, {
                            label: "参数值",
                            render: (item) => item.enums.join(",")
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
              label: "产品名",
              key: "productName"
            }, {
              label: "价格",
              key: "balancePrice"
            }, {
              label: "带宽限制",
              render: (item) => {
                if (item.balanceMethod === "METHOD_HOUR") {
                  return item.bandwidthLimit + "m";
                }
                return "-";
              }
            }, {
              label: "代理端口",
              key: "mappingPortSpace"
            }, {
              label: "随机隧道",
              render: (item) => {
                return item.randomTurning ? "是" : "否";
              }
            }, {
              label: "failover次数",
              key: "maxFailoverCount"
            }, {
              label: "代理连接超时(毫秒)",
              key: "connectTimeout"
            }, {
              label: "计费方式",
              render: (item) => {
                return {
                  "METHOD_HOUR": "按小时",
                  "METHOD_FLOW": "按流量(0.01G)"
                }[item.balanceMethod];
              }
            }, {
              label: "操作",
              render: (item) => (
                <>
                  <Button
                    startIcon={<EditIcon style={{ fontSize: 16 }}/>}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => {
                      setForm({ ...item });
                      setOpenDialog(true);
                    }}
                    variant="contained">编辑</Button>


                  {(user.mock && item.balanceMethod === "METHOD_HOUR") ? (
                    <Button
                      startIcon={<EditIcon style={{ fontSize: 16 }}/>}
                      size="small"
                      color="primary"
                      className={classes.tableButton}
                      onClick={() => {
                        setEdit(item);
                        setOpenChange(true);
                        setPrice(item.balancePrice);
                        setBandwidth(item.bandwidthLimit);
                      }}
                      variant="contained">修改价格 | 带宽</Button>
                  ) : null}
                  <Switch
                    checked={item.enabled}
                    onChange={() => {
                      item.enabled = !item.enabled;
                      doEditOrder(item);
                    }}
                    color="primary"
                    inputProps={{ "aria-label": "primary checkbox" }}
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
          shape="rounded"/>
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
              <Grid item xs={12}>
                <Typography className={classes.mt} variant="h6">
                  计费方式
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup row value={form.balanceMethod}
                              onChange={(e) => setForm({ ...form, balanceMethod: e.target.value })}>
                    <FormControlLabel value="METHOD_HOUR" control={<Radio/>} label="按小时计费"/>
                    <FormControlLabel value="METHOD_FLOW" control={<Radio/>} label="按流量计费(0.01G)"/>
                  </RadioGroup>
                </FormControl>
                <Typography variant="h6">
                  代理连接超时（毫秒）
                </Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  type="number"
                  placeholder="请输入代理连接"
                  value={form.connectTimeout}
                  onChange={(e) => setForm({ ...form, connectTimeout: e.target.value })}
                />
                <Typography gutterBottom variant="h6">failover次数</Typography>
                <Select
                  className={classes.dialogInput}
                  style={{ height: "40px" }}
                  variant="outlined"
                  value={form.maxFailoverCount}
                  onChange={(e) => setForm({ ...form, maxFailoverCount: e.target.value })}
                >
                  {Array.from({ length: 10 }).map((d, index) => (
                    <MenuItem key={d + index} value={index+1}>
                      {index+1}
                    </MenuItem>
                  ))}
                </Select>

                <Typography gutterBottom variant="h6">随机隧道</Typography>
                <Switch color="primary" checked={form.randomTurning} onChange={(e) => setForm(
                  { ...form, randomTurning: e.target.checked })} />

              </Grid>
            </Grid>
          </>
        )}
        okText="保存"
        okType="primary"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return doEditOrder(form);
        }}
      />
      <OpeDialog
        title="修改带宽 | 价格"
        opeContent={(
          <>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12}>
                <Typography variant="h6">
                  价格
                </Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}/>
                <Typography className={classes.mt} variant="h6">
                  带宽
                </Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  value={bandwidth}
                  onChange={(e) => setBandwidth(e.target.value)}/>
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
            newOrderPrice: price
          }).then(res => {
            if (res.status === 0) {
              setRefresh(+new Date());
              setEdit({});
              return "操作成功";
            }
            throw new Error(res.message);
          });
        }}
        okText="保存"
        okType="primary"
      />
    </Card>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DataTable;
