import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useSnackbar } from 'notistack';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import Loading from '../Loading';

const useStyles = makeStyles(theme => ({
  dialog: {
    minWidth: theme.spacing(70)
  },
}));

const DeleteUser = props => {
  const {
    title,
    opeText,
    opeContent,
    openDialog,
    setOpenDialog,
    doDialog,
    okText,
    okType
  } = props;

  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  return (
    <Dialog onClose={() => setOpenDialog(false)} open={openDialog}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={classes.dialog}>
        {opeContent ? opeContent : (loading ? (
          <Loading />
        ) : (
            <DialogContentText>
              {opeText}
            </DialogContentText>
          ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} color="primary">
          取消
        </Button>
        <Button onClick={() => {
          setLoading(true);
          doDialog().then((message) => {
            enqueueSnackbar(message, {
              variant: 'success',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
            });
            setOpenDialog(false);
          }).catch((e) => {
            enqueueSnackbar(e.message, {
              variant: 'error',
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
            });
          }).then(() => {
            setLoading(false);
          });
        }} color={okType || "secondary"} autoFocus>
          {okText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUser;
