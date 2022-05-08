import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/styles";
import { Table } from "views/common";
import {
  Card,
  CardActions,
  CardContent
} from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  nameContainer: {
    display: "flex",
    alignItems: "center"
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    justifyContent: "center"
  },
  tableButton: {
    marginRight: theme.spacing(1)
  }
}));

const DataTable = props => {
  const { className, data, total, rowsPerPage, pageState, ...rest } = props;
  const [page, setPage] = pageState;

  const classes = useStyles();

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <Table
          data={data}
          columns={[
            {
              label: "ID",
              key: "id"
            }, {
              label: "操作人",
              key: "operator"
            }, {
              label: "充值用户",
              key: "user"
            }, {
              label: "到账金额",
              key: "rechargeAmount"
            }, {
              label: "实际充值金额",
              key: "actualPayAmount"
            }, {
              label: "充值前余额",
              key: "remainBalance"
            }, {
              label: "充值前实际总额",
              key: "remainBalance"
            }, {
              label: "充值时间",
              render: (item) => moment(new Date(item.createTime)).format("YYYY-MM-DD HH:mm:ss")
            },
            {
              label: "备注",
              key: "comment"
            }
          ]}
        />
      </CardContent>
      <CardActions className={classes.actions}>
        <Pagination
          count={Math.ceil(total / rowsPerPage) || 1}
          page={page}
          onChange={handlePageChange}
          shape="rounded"/>
      </CardActions>
    </Card>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DataTable;
