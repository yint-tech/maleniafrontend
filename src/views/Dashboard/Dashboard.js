import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {
  Device,
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  useEffect(() => {
    const getData = () => {
    }
    getData();
  }, []);

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          sm={12}
          xs={12}
        >
          <Device />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
