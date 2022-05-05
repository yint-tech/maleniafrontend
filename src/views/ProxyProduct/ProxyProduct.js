import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';

import {
  Card,
  Typography,
  Button
} from '@material-ui/core';

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
  const [products, setProducts] = useState([]);
  const [buys, setBuys] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [refresh, setRefresh] = useState(+new Date());

  const [tags, setTags] = useState([]);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    if (!user.apiToken) return
    const getData = () => {
      apis.listAllProducts({ page: 1, pageSize: 1000 }).then(res => {
        if (res.status === 0) {
          let temp = res.data.filter(item => {
            return item.enabled || user.isAdmin
          });
          setProducts(temp);
          // 获取 tags
          let t = [];
          temp.map(item => {
            t = t.concat(item.features.split(','));
            return item;
          });
          setTags(t);
          setFilters(t);
        }
      }).catch(e => console.log(e));
      apis.listAllOrders({ page: 1, pageSize: 1000 }).then(res => {
        if (res.status === 0) {
          setBuys(res.data.map(item => item.productId));
        }
      }).catch(e => console.log(e));
    }
    getData();
  }, [refresh, user]);

  const showData = products.filter(item => {
    let features = item.features?.split(',') || [];
    let hasTag = false;
    for (let i of features) {
      if (filters.includes(i)) {
        hasTag = true;
      }
    }
    if (!hasTag) return false;
    return JSON.stringify(item).includes(keyword);
  });

  return (
    <div className={classes.root}>
      <Toolbar onInputChange={(k) => {
        setKeyword(k);
        setPage(1);
      }} setRefresh={setRefresh} />
      <Card className={classes.tags}>
        {tags.map(item => (
          <Button
            key={item}
            size="small"
            onClick={() => {
              if (filters.includes(item)) {
                setFilters([...filters].filter(f => f !== item));
              } else {
                setFilters([...filters, item]);
              }
            }}
            className={filters.includes(item) ? classes.tagButtonActive : classes.tagButton}>
            <Typography variant="subtitle2" style={{color: filters.includes(item) ? '#fff' : '#546e7a'}}>
              {item}
            </Typography>
          </Button>
        ))}
      </Card>
      <div className={classes.content}>
        <Table
          data={showData.slice((page - 1) * limit, page * limit)}
          total={showData.length}
          rowsPerPage={limit}
          pageState={[page, setPage]}
          setRefresh={setRefresh}
          buys={buys} />
      </div>
    </div>
  );
};

export default P;
