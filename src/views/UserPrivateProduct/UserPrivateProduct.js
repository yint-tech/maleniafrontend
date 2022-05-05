import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { Table } from './components';

import apis from 'apis';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const User = () => {
  const classes = useStyles();

  const [groups, setGroups] = useState([]);
  const [privateProducts, setPrivateProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [refresh, setRefresh] = useState(+new Date());

  useEffect(() => {
    const getData = () => {
      apis.getUserPrivateProducts().then(res => {
        if (res.status === 0) {
          setGroups(res.data);
        }
      }).catch(e => console.log(e));
      apis.listAllProducts().then(res => {
        if (res.status === 0) {
          let privateProductss = res.data.filter(x => x.privateProduct && x.enabled);
          setPrivateProducts(privateProductss);
        }
      }).catch(e => console.log(e));
    }
    getData();
  }, [refresh]);

  const showData = groups;
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Table
          data={showData.slice((page - 1) * limit, page * limit)}
          total={showData.length}
          rowsPerPage={limit}
          pageState={[page, setPage]}
          setRefresh={setRefresh}
          privateProducts={privateProducts} />
      </div>
    </div>
  );
};

export default User;
