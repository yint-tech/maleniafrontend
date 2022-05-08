import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { Toolbar, Table } from './components';
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
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [refresh, setRefresh] = useState(+new Date());

  useEffect(() => {
    const getData = () => {
      Promise.all([
        apis.listAllOrders({ page: 1, pageSize: 1000 }),
        apis.listAllProducts({ page: 1, pageSize: 1000 })
      ]).then(res => {
        if (res[0].status === 0 && res[1].status === 0) {
          let products = {};
          res[1].data.map(item => {
            products[item.productId] = item;
            return item;
          });
          let groups = res[0].data;
          groups = groups.map(item => {
            return {
              ...products[item.productId],
              ...item,
            }
          });
          setGroups(groups);
        }
      }).catch(e => console.log(e));
    }
    getData();
  }, [refresh]);

  const showData = groups.filter(item => {
    return JSON.stringify(item).includes(keyword);
  });

  return (
    <div className={classes.root}>
      <Toolbar onInputChange={(k) => {
        setKeyword(k);
        setPage(1);
      }} setRefresh={setRefresh} />
      <div className={classes.content}>
        <Table
          data={showData.slice((page - 1) * limit, page * limit)}
          total={showData.length}
          rowsPerPage={limit}
          pageState={[page, setPage]}
          setRefresh={setRefresh} />
      </div>
    </div>
  );
};

export default User;
