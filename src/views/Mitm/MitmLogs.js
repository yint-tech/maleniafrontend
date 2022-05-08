import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Button
} from '@material-ui/core';

import apis from 'apis';

const useStyles = makeStyles(theme => ({
  logPanel: {
    maxWidth: '75%'
  },
  pre: {
    width: '100%',
    overflow: 'auto',
    background: '#f1f1f1',
    borderRadius: theme.spacing(1),
    maxHeight: theme.spacing(100),
    padding: theme.spacing(2),
    whiteSpace: 'pre-wrap',
    boxSizing: 'border-box'
  },
  listText: {
    cursor: 'pointer'
  }
}));

const Logs = () => {
  const classes = useStyles();

  const [debugLog, setDebugLog] = useState({});
  const [activeDebugLog, setActiveDebugLog] = useState('');
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    apis.mitmLogs().then(res => {
      if (res.status === 0) {
        setDebugLog(res.data);
        setActiveDebugLog(Object.keys(res.data)[0]);
      }
    }).catch(e => console.log(e));
  }, [refresh]);

  return (
    <Grid
      container
      spacing={6}
      wrap="wrap"
    >
      <Grid item >
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => setRefresh(Math.random())}
        >刷新</Button>
        <List dense>
          {Object.keys(debugLog).map(item => (
            <ListItem
              key={item}
              className={classes.listText}
              onClick={() => setActiveDebugLog(item)}>
              <ListItemText primary={(<code style={{ color: activeDebugLog === item ? '#2196f3' : '' }}>{item}</code>)} />
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={true} className={classes.logPanel}>
        <pre className={classes.pre}>{(activeDebugLog && debugLog[activeDebugLog]) ? debugLog[activeDebugLog] : ''}</pre>
      </Grid>
    </Grid>
  );
};

export default Logs;
