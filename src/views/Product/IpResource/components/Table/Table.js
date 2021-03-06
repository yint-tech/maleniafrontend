import React, { useState, useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Table } from 'views/common';
import { useSnackbar } from 'notistack';
import { OpeDialog } from 'components';
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Typography,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
import { AppContext } from 'adapter';

import apis from 'apis';

const useStyles = makeStyles(theme => ({
  root: {},
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
  mt: {
    marginTop: theme.spacing(2)
  },
  inputItem: {
    width: '100%'
  }
}));

const DataTable = props => {
  const history = useHistory();
  const { user } = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const { className, data, total, rowsPerPage, pageState, setRefresh, ...rest } = props;
  const [page, setPage] = pageState;

  const [openDialog, setOpenDialog] = useState(false);
  const [edit, setEdit] = useState({});
  const [stopDialog, setStopDialog] = useState({});

  const [balanceMethod, setBalanceMethod] = useState('METHOD_HOUR');
  const [referrer, setReferrer] = useState('');
  const [showReferrer, setShowReferrer] = useState(false);

  const classes = useStyles();

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleChange = (item) => {
    apis.updateStatus({ productId: item.productId, enabled: !item.enabled })
      .then(res => {
        if (res.status === 0) {
          enqueueSnackbar('????????????', {
            variant: 'success',
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
          setStopDialog({});
          setRefresh(+new Date());
        } else {
          enqueueSnackbar(res.message, {
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
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <Table
          collapse={true}
          renderCollapse={(item) => (
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12} >
                <Typography gutterBottom variant="h6" >
                  ???????????????{item.sourceKey}
                </Typography>
                <Typography gutterBottom variant="h6" >
                  ?????????{item.description}
                </Typography>
                {item.tuningParam && item.tuningParam.items && item.tuningParam.items.length && (
                  <>
                    <Typography gutterBottom variant="h6" >
                      ??????????????????
                    </Typography>
                    <Table
                      style={{ height: 'auto', marginBottom: 10 }}
                      size="small"
                      data={item.tuningParam.items}
                      columns={[{
                        label: '??????',
                        key: 'param'
                      }, {
                        label: '???????????????',
                        render: (item) => item.nullable ? '???' : '???'
                      }, {
                        label: '??????',
                        key: 'description'
                      }, {
                        label: '?????????',
                        render: (item) => item.enums.join(',')
                      }]}
                    />
                  </>
                )}
                {user.isAdmin && (
                  <>
                    <Typography gutterBottom variant="h6" >
                      ??????????????????{item.authUserNameExpression}
                    </Typography>
                    <Typography gutterBottom variant="h6" >
                      ???????????????{item.loadProcessor}
                    </Typography>
                    <Typography gutterBottom variant="h6" >
                      ??????URL???{item.loadUrl.replace('echo://', '')}
                    </Typography>
                    <Typography gutterBottom variant="h6" >
                      ???????????????????????????{item.upstreamUserName}
                    </Typography>
                    <Typography gutterBottom variant="h6" >
                      ???????????????????????????{item.upstreamUserPassword}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
          )}
          data={data}
          columns={[
            {
              label: '????????????',
              key: 'sourceKey'
            }, {
              label: '??????',
              key: 'description'
            },
            {
              label: '???????????????',
              key: 'poolSize'
            },
            {
              label: '????????????',
              key: 'loadProcessor'
            }, {
              label: '??????',
              render: (item) => (
                <>
                  {user.isAdmin ? (
                    <>
                      <Button
                        startIcon={<DeviceHubIcon style={{ fontSize: 16 }} />}
                        size="small"
                        color="primary"
                        className={classes.tableButton}
                        onClick={() => history.push('/ipResourceEdit/' + item.id)}
                        variant="contained">??????</Button>
                    </>
                  ) : null}
                </>
              )
            }
          ]}
        />
      </CardContent>
      <CardActions className={classes.actions}>
        <Pagination
          count={Math.ceil(total / rowsPerPage) || 1}
          page={page}
          onChange={handlePageChange}
          shape="rounded" />
      </CardActions>
      <OpeDialog
        title="??????????????????"
        opeContent={(
          <>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12} >
                <Typography gutterBottom variant="h6" >
                  ????????????{edit.productName}
                </Typography>
                <Divider />
                <Typography className={classes.mt} variant="h6" >
                  ????????????
                </Typography>
                <FormControl component="fieldset" >
                  <RadioGroup row value={balanceMethod} onChange={(e) => setBalanceMethod(e.target.value)}>
                    <FormControlLabel value="METHOD_HOUR" control={<Radio />} label="???????????????" />
                    <FormControlLabel value="METHOD_FLOW" control={<Radio />} label="???????????????(G)" />
                  </RadioGroup>
                </FormControl>
                <Typography gutterBottom variant="h6" >
                  ?????????{balanceMethod === 'METHOD_HOUR' ? edit.hourPrice : edit.flowPrice}
                </Typography>
                <Typography gutterBottom variant="h6" >
                  ?????? url???{edit.loadUrl}
                </Typography>
                <Divider />
                <Grid container spacing={6} >
                  <Grid item xs={6} >
                    {showReferrer ? (
                      <>
                        <Typography gutterBottom className={classes.mt} variant="h6" >
                          ?????????
                        </Typography>
                        <TextField
                          className={classes.inputItem}
                          size="small"
                          variant="outlined"
                          placeholder="??????????????????"
                          value={referrer}
                          onChange={(e) => setReferrer(e.target.value)} />
                      </>
                    ) : (
                      <Button onClick={() => setShowReferrer(true)} color="primary">?????????????</Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return apis.purchase({
            productId: edit.productId,
            balanceMethod: balanceMethod,
            referrer: referrer
          }).then(res => {
            if (res.status === 0) {
              setRefresh(+new Date());
              setEdit({});
              setBalanceMethod('METHOD_HOUR');
              setOpenDialog(false);
              return '????????????';
            }
            throw new Error(res.message);
          });
        }}
        okText="??????"
        okType="primary" />
      <Dialog onClose={() => setStopDialog({})} open={stopDialog.productId}>
        <DialogTitle style={{width: 400}}>????????????????????????</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ????????????{stopDialog.sourceKey}
          </DialogContentText>
          <DialogContentText>
            ???????????????{stopDialog.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStopDialog({})}>
            ??????
          </Button>
          <Button onClick={() => {
            handleChange(stopDialog);
          }} color="secondary" autoFocus>
            ??????
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DataTable;
