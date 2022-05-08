import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/styles";

import {
  Paper,
  Tabs,
  Tab
} from "@material-ui/core";
import { AppContext } from "adapter";
import ProxyProduct from "./ProxyProduct";
import UserPrivateProduct from "./UserPrivateProduct";
import IpResource from "./IpResource";
import PurchasedProduct from "./PurchasedProduct";

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

function Product() {
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
            <Tab label="产品列表"/>
            <Tab label="已购产品"/>

            {
              user.isAdmin ? <Tab label="私有产品"/> : null
            }
            {
              user.isAdmin ? <Tab label="IP源"/> : null
            }

          </Tabs>
          <div className={classes.content}>
            <TabPanel value={value} index={0}>
              <ProxyProduct/>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <PurchasedProduct/>
            </TabPanel>

            {
              user.isAdmin ?
                <TabPanel value={value} index={2}>
                  <UserPrivateProduct/>
                </TabPanel>
                : null
            }

            {
              user.isAdmin ?
                <TabPanel value={value} index={3}>
                  <IpResource/>
                </TabPanel>
                : null
            }

          </div>
        </Paper>
      </div>
    </div>
  );
};

export default Product;
