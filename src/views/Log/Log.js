import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { Table } from './components';
import {
  Card,
  CardHeader,
  CardContent,
  Divider
} from '@material-ui/core';

import apis from 'apis';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  logPanel: {
    maxWidth: '75%'
  }
  ,
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

const User = () => {
  const classes = useStyles();

  const [limit] = useState(10);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [log, setLog] = useState([]);
  useEffect(() => {
    apis.logList({ page, pageSize: limit }).then(res => {
      if (res.status === 0) {
        setTotal(res.data.total);
        setLog(res.data.records);
      }
    }).catch(e => console.log(e));
  }, [page, limit]);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Card>
          <CardHeader title="系统日志"></CardHeader>
          <Divider />
          <CardContent>
            <Table
              data={log}
              total={total}
              rowsPerPage={limit}
              pageState={[page, setPage]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default User;
