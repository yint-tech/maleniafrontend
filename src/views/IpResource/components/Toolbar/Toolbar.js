import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import { SearchInput } from 'components';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { AppContext } from 'adapter';

import clsx from 'clsx';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {}
}));

const Toolbar = props => {
  const { user } = useContext(AppContext);
  const { className, onInputChange, setRefresh, ...rest } = props;
  const history = useHistory();
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
        <span className={classes.spacer} />
        {user.isAdmin ? (
          <Button
            startIcon={<AddPhotoAlternateIcon />}
            color="primary"
            variant="contained"
            onClick={() => history.push('/ipResourceEdit')}
          >
            添加IP资源
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default Toolbar;
