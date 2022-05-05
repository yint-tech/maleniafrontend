import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";

import {
  Paper,
  Tabs,
  Tab
} from "@material-ui/core";

import FileManager from "./FileManager";
import GroovyManager from "./GroovyManager";
import MitmLogs from "./MitmLogs";

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

function File() {
  const classes = useStyles();

  const [value, setValue] = useState(0);

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
            <Tab label="脚本管理"/>
            <Tab label="资产文件"/>
            <Tab label="mitm日志"/>
            <Tab label="抓包控制台"/>
          </Tabs>
          <div className={classes.content}>
            <TabPanel value={value} index={0}>
              <GroovyManager/>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <FileManager/>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <MitmLogs />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <p>TODO</p>
            </TabPanel>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default File;
