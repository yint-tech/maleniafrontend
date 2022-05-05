import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { Table } from './components';
import { useParams } from 'react-router-dom';

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
  const params = useParams();

  const [groups, setGroups] = useState([]);
  const [ipResources, setIpResources] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [refresh, setRefresh] = useState(+new Date());
  const productId = params.id

  useEffect(() => {
    const getData = () => {
      apis.listProductIpSources({ productId: productId}).then(res => {
        if (res.status === 0) {
          setGroups(res.data);
        }
      }).catch(e => console.log(e));

      apis.listAllIpResources().then(res => {
        if (res.status === 0) {
          setIpResources(res.data);
        }
      }).catch(e => console.log(e));
    }
    getData();
  }, [refresh, productId]);

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
          ipResources={ipResources}
          productId={productId} />
      </div>


    </div>
  );
};

export default User;
