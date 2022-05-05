import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Paper, Input, IconButton, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Select from '@material-ui/core/Select';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '4px',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    display: 'flex',
    flexBasis: 420
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  input: {
    flexGrow: 1,
    fontSize: '14px',
    lineHeight: '16px',
    letterSpacing: '-0.05px'
  }
}));

const SearchInput = props => {
  const { className, onChange, selects, select, setSelect, style, ...rest } = props;
  const classes = useStyles();
  const [value, setValue] = useState('');

  return (
    <Paper
      {...rest}
      className={clsx(classes.root, className)}
      style={style}
    >
      {
        selects && selects.length > 0 ? (
          <Select
            value={select || 'all'}
            onChange={e => setSelect(e.target.value)}
            disableUnderline
          >
            {selects.map((s, i) => (
              <MenuItem key={String(i)} value={s.value}>{s.key}</MenuItem>
            ))}
          </Select>
        ) : null
      }
      <Input
        {...rest}
        value={value}
        // onKeyUp={e => {
        //   if (e.keystatus === 13) {
        //     onChange(value)
        //   }
        // }}
        onChange={(e) => {
          const value = e.target.value;
          setValue(value);
          onChange(value);
        }}
        className={classes.input}
        disableUnderline
      />
      <IconButton size="small" color="primary" onClick={() => onChange(value)}>
        <SearchIcon style={{ fontSize: 22 }} />
      </IconButton>
    </Paper>
  );
};

SearchInput.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object
};

export default SearchInput;
