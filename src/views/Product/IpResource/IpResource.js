import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import { Toolbar, Table } from './components';
import { AppContext } from 'adapter';
import apis from 'apis';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  tags: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  tagButton: {
    border: '1px dashed #f0f0f0',
    marginRight: theme.spacing(1)
  },
  tagButtonActive: {
    border: '1px dashed #2196f3',
    backgroundColor: '#2196f3',
    marginRight: theme.spacing(1)
  }
}));

const P = () => {
  const classes = useStyles();

  const { user } = useContext(AppContext);
  const [ipResources, setIpResources] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [refresh, setRefresh] = useState(+new Date());

  useEffect(() => {
    const getData = () => {
      apis.listAllIpResources({ page: 1, pageSize: 1000 }).then(res => {
        if (res.status === 0) {
          setIpResources( res.data);
        }
      }).catch(e => console.log(e));
    }
    getData();
  }, [refresh, user]);

  const showData = ipResources.filter(item => {
    if(keyword && keyword.length >0){
      return JSON.stringify(item).includes(keyword);
    }
    return true;
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
          setRefresh={setRefresh}/>
      </div>
    </div>
  );
};

export default P;
