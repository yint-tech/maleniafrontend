import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Card, CardContent, CardHeader, Divider, MenuItem, Select } from "@material-ui/core";
import { Table } from "views/common";
import { MetricCharts } from "components/MetricCharts";
import clsx from "clsx";
import apis from "apis";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%"
  },
  content: {
    alignItems: "center",
    display: "flex"
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
    textAlign: "center"
  },
  url: {
    display: "flex",
    alignItems: "center",
    fontSize: 16,
    lineHeight: "1.2em",
    wordBreak: "break-all",
    cursor: "pointer"
  },
  padding: {
    padding: theme.spacing(2)
  },
  formControl: {
    width: theme.spacing(20),
    margin: theme.spacing(2)
  },
  pop: {
    padding: theme.spacing(2)
  },
  popBtns: {
    marginTop: theme.spacing(2),
    textAlign: "center"
  }
}));


const Budget = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const [top10, setTop10] = useState([]);

  const [metricChartName, setMetricChartName] = useState("");
  const [metricChartTime, setMetricChartTime] = useState("minutes");
  const [metricNames, setMetricNames] = useState([]);
  useEffect(() => {
    apis.adminGetMetricNames().then(res => {
      if (res?.data) {
        setMetricNames(res.data);
        setMetricChartName(res.data[0]);
      }
    });
  }, []);


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >

      <CardHeader title="系统指标" action={(
        <>
          <Select
            style={{ width: "200px", height: "40px", overflow: "hidden" }}
            variant="outlined"
            value={metricChartTime}
            onChange={(e) => {
              setMetricChartTime(e.target.value);
            }}
          >
            {["minutes", "hours", "days"].map(d => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
          <Select
            style={{ width: "200px", height: "40px", overflow: "hidden" }}
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
      )}/>
      <Divider/>
      <MetricCharts
        metricAccuracy={metricChartTime}
        name={metricChartName}
        poly={{}}
        isAdmin={true}
        height={"300px"}/>


      <Divider/>
      <CardHeader title="TOP10 带宽用户"/>
      <Divider/>
      <CardContent>
        <Table
          data={top10}
          columns={[
            {
              label: "用户",
              key: "purchaseUser"
            }, {
              label: "产品名",
              key: "productName"
            }, {
              label: "用量",
              key: "productName",
              render: (item) => {
                return (item.rateUsage / 1024 / 1024).toFixed(2) + "m";
              }
            }
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default Budget;
