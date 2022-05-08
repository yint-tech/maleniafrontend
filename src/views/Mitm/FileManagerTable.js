import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import { Table } from 'views/common';
import { useSnackbar } from 'notistack';
import { AppContext } from 'adapter';
import {
  Button,
  Card,
  CardActions,
  CardContent,
} from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import GetAppIcon from '@material-ui/icons/GetApp';
import apis from 'apis';

const useStyles = makeStyles(theme => ({
  content: {
    padding: 0
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    justifyContent: 'center'
  },
  tableButton: {
    marginRight: theme.spacing(1)
  },
}));

const DataTable = props => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AppContext);
  const { data, rowsPerPage, pageState, setRefresh } = props;
  const [page, setPage] = pageState;

  const classes = useStyles();

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const doDelete = (item) => {
    apis
      .deleteAsset({ id: item.id })
      .then(res => {
        if (res.status === 0) {
          enqueueSnackbar('删除成功', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
          setRefresh(+new Date());
        } else {
          enqueueSnackbar(res.error, {
            variant: 'error',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
        }
      }).catch((e) => {
        enqueueSnackbar(e.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      });
  }

  return (
    <Card>
      <CardContent className={classes.content}>
        <Table
          data={data.slice((page - 1) * rowsPerPage, page * rowsPerPage)}
          columns={[{
            label: '操作人',
            key: 'user'
          }, {
            label: '文件路径',
            key: 'path'
          }, {
            label: '更新时间',
            render: (item) => moment(new Date(item.updateTime)).format('YYYY-MM-DD HH:mm:ss')
          }, {
            label: '操作',
            render: (item) => {
              return (
                <>
                  <Button
                    startIcon={<GetAppIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => {
                      window.open(`/malenia/user-op/downloadAsset?token=${user.loginToken}&id=${item.id}`)
                    }}
                    variant="contained">下载</Button>
                  <Button
                    startIcon={<DeleteForeverIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="secondary"
                    className={classes.tableButton}
                    onClick={() => doDelete(item)}
                    variant="contained">删除</Button>
                </>
              )
            }
          },]}
        />
      </CardContent>
      <CardActions className={classes.actions}>
        <Pagination
          count={Math.ceil(data.length / rowsPerPage) || 1}
          page={page}
          onChange={handlePageChange}
          shape="rounded" />
      </CardActions>
    </Card>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DataTable;
