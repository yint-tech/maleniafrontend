import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { SearchInput } from 'components';

import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  searchInput: {},
}));

const Toolbar = props => {
  const { className, onInputChange, setRefresh, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          onChange={(v) => onInputChange(v)}
          placeholder="请输入关键词进行查询"
        />
      </div>
    </div>
  );
};

export default Toolbar;
