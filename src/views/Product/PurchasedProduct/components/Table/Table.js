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
        return "????????????";
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
                    <AlertTitle>???????????????</AlertTitle>
                    ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? <Link to="/dashboard"><strong>?????????</strong></Link>
                  </Alert>
                ) : (
                  <>
                    <Typography gutterBottom variant="subtitle2">
                      ???????????????????????? <a href="https://baike.baidu.com/item/curl/10098606?fr=aladdin" target="_blank"
                                  rel="noopener noreferrer">curl</a> . eg.
                    </Typography>
                    <code>
                      curl
                      -x {user.authAccount}:{user.authPwd}@{window.location.hostname}:{item.mappingPortSpace && item.mappingPortSpace.split("-")[0]} https://www.baidu.com/
                    </code>
                    {(item.tuningParam && item.tuningParam.items && item.tuningParam.items.length) ? (
                      <>
                        <Typography gutterBottom variant="h6" style={{ marginTop: 10 }}>
                          ??????????????????
                        </Typography>
                        <Table
                          style={{ height: "auto" }}
                          size="small"
                          data={item.tuningParam.items}
                          columns={[{
                            label: "??????",
                            key: "param"
                          }, {
                            label: "???????????????",
                            render: (item) => item.nullable ? "???" : "???"
                          }, {
                            label: "??????",
                            key: "description"
                          }, {
                            label: "?????????",
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
              label: "?????????",
              key: "productName"
            }, {
              label: "??????",
              key: "balancePrice"
            }, {
              label: "????????????",
              render: (item) => {
                if (item.balanceMethod === "METHOD_HOUR") {
                  return item.bandwidthLimit + "m";
                }
                return "-";
              }
            }, {
              label: "????????????",
              key: "mappingPortSpace"
            }, {
              label: "????????????",
              render: (item) => {
                return item.randomTurning ? "???" : "???";
              }
            }, {
              label: "failover??????",
              key: "maxFailoverCount"
            }, {
              label: "??????????????????(??????)",
              key: "connectTimeout"
            }, {
              label: "????????????",
              render: (item) => {
                return {
                  "METHOD_HOUR": "?????????",
                  "METHOD_FLOW": "?????????(0.01G)"
                }[item.balanceMethod];
              }
            }, {
              label: "??????",
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
                    variant="contained">??????</Button>


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
                      variant="contained">???????????? | ??????</Button>
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
        title="????????????"
        opeContent={(
          <>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12}>
                <Typography className={classes.mt} variant="h6">
                  ????????????
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup row value={form.balanceMethod}
                              onChange={(e) => setForm({ ...form, balanceMethod: e.target.value })}>
                    <FormControlLabel value="METHOD_HOUR" control={<Radio/>} label="???????????????"/>
                    <FormControlLabel value="METHOD_FLOW" control={<Radio/>} label="???????????????(0.01G)"/>
                  </RadioGroup>
                </FormControl>
                <Typography variant="h6">
                  ??????????????????????????????
                </Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  type="number"
                  placeholder="?????????????????????"
                  value={form.connectTimeout}
                  onChange={(e) => setForm({ ...form, connectTimeout: e.target.value })}
                />
                <Typography gutterBottom variant="h6">failover??????</Typography>
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

                <Typography gutterBottom variant="h6">????????????</Typography>
                <Switch color="primary" checked={form.randomTurning} onChange={(e) => setForm(
                  { ...form, randomTurning: e.target.checked })} />

              </Grid>
            </Grid>
          </>
        )}
        okText="??????"
        okType="primary"
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return doEditOrder(form);
        }}
      />
      <OpeDialog
        title="???????????? | ??????"
        opeContent={(
          <>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12}>
                <Typography variant="h6">
                  ??????
                </Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}/>
                <Typography className={classes.mt} variant="h6">
                  ??????
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
              return "????????????";
            }
            throw new Error(res.message);
          });
        }}
        okText="??????"
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
