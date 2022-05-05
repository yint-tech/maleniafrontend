import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  image: {
    margin: theme.spacing(4, 0, 2),
    display: 'inline-block',
    width: theme.spacing(20)
  }
}));

const Empty = ({ text }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        spacing={4}
      >
        <Grid
          item
          lg={6}
          xs={12}
        >
          <div className={classes.content}>
            <img
              alt="Under development"
              className={classes.image}
              src="/images/not_found.png"
            />
            <Typography variant="caption">
              {text}
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Empty;
