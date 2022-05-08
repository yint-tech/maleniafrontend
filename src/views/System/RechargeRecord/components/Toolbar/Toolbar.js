import React, { useContext } from "react";
import { makeStyles } from '@material-ui/styles';
import { SearchInput } from 'components';
import { AppContext } from "adapter";
import moment from "moment";
import clsx from 'clsx';
import { Button } from "@material-ui/core";

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
  searchInput: {},
  dialog: {
    width: theme.spacing(60)
  },
  dialogInput: {
    width: '100%'
  },
  ml: {
    marginLeft: theme.spacing(2)
  },
}));

const Toolbar = props => {
  const { className, onInputChange, ...rest } = props;
  const { user } = useContext(AppContext);
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
        <Button
          style={{ marginRight: 10 }}
          color="primary"
          size="medium"
          variant="contained"
          onClick={() => {
            window.open(`/malenia/admin-report/exportRechargeRecord?token=${user.loginToken}&startTime=${moment(new Date()).subtract(90, "days").format("YYYY-MM-DD HH:mm:ss")}&endTime=${moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}`);
          }}>导出 EXCEL</Button>
      </div>
    </div>
  );
};

export default Toolbar;
