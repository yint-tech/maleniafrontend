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
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [refresh, setRefresh] = useState(+new Date());

  useEffect(() => {
    const getData = () => {
      apis.userList({ page: 1, pageSize: 1000 }).then(res => {
        if (res.status === 0) {
          setGroups(res.data.records);
        }
      }).catch(e => console.log(e));
      apis.listAllProducts({ page: 1, pageSize: 1000 }).then(res => {
        if (res.status === 0) {
          // let temp = res.data.filter(item => {
          //   return item.enabled || user.isAdmin
          // });
          setProducts(res.data);
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
          data={showData.slice(((page > 0 ? page : 1) - 1) * limit, (page > 0 ? page : 1) * limit)}
          total={showData.length}
          rowsPerPage={limit}
          products={products}
          pageState={[page, setPage]}
          setRefresh={setRefresh} />
      </div>
    </div>
  );
};

export default User;
