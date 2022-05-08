import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/styles";

import {
  Paper,
  Tabs,
  Tab
} from "@material-ui/core";
import { AppContext } from "adapter";
import AdminDashBoard from "./AdminDashBoard";
import Config from "./Config";
import Log from "./Log";
import ProxyNode from "./ProxyNode";
import RechageRecord from "./RechargeRecord";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

function TabPanel(props) {
  const { children, value, index } = props;
  return value === index ? children : null;
}

function System() {
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const { user } = useContext(AppContext);

  const handleChange = (event, val) => {
    setValue(val);
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Paper className={classes.root}>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
          >
            <Tab label="概览"/>
            <Tab label="系统设置"/>
            <Tab label="代理集群节点"/>
            <Tab label="用户访问日志"/>
            <Tab label="充值记录"/>


          </Tabs>
          <div className={classes.content}>
            <TabPanel value={value} index={0}>
              <AdminDashBoard/>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Config/>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <ProxyNode/>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Log/>
            </TabPanel>
            <TabPanel value={value} index={4}>
              <RechageRecord/>
            </TabPanel>


          </div>
        </Paper>
      </div>
    </div>
  );
};

export default System;
