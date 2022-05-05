import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import { SearchInput, OpeDialog } from 'components';
import {
  Button,
  TextField,
  Typography,
  Grid,
  Input,
} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Table from './FileManagerTable';

import apis from 'apis';

const useStyles = makeStyles(theme => ({
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  dialogInput: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
}));

function File() {
  const classes = useStyles();
  const [limit] = useState(10);

  const fileRef = useRef();
  const [file, setFile] = useState('');
  const [filePath, setFilePath] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [asset, setAsset] = useState([]);
  const [refresh, setRefresh] = useState(+new Date());
  useEffect(() => {
    apis.listAsset({ page: 1, pageSize: 1000 }).then(res => {
      if (res.status === 0) {
        setAsset(res.data);
      }
    }).catch(e => console.log(e));
  }, [refresh]);

  return (
    <div>
      <div className={classes.row}>
        <SearchInput
          onChange={(val) => setQuery(val)}
          placeholder="请输入关键词进行查询"
        />
        <span style={{ flexGrow: 1 }} />
        <Button
          startIcon={<CloudUploadIcon />}
          color="primary"
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          添加文件
        </Button>
      </div>
      <Table
        data={asset.filter(item => JSON.stringify(item).includes(query))}
        rowsPerPage={limit}
        setRefresh={setRefresh}
        pageState={[page, setPage]} />
      <OpeDialog
        title="添加文件"
        opeContent={(
          <>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12} >
                <Typography gutterBottom variant="h6" >文件</Typography>
                <Input
                  className={classes.dialogInput}
                  inputRef={fileRef}
                  size="small"
                  type="file"
                  variant="outlined"
                  value={file}
                  onChange={(e) => {
                    setFilePath('/' + fileRef.current.files[0].name)
                    setFile(e.target.value)
                  }} />
                <Typography gutterBottom variant="h6" >文件路径</Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)} />
              </Grid>
            </Grid>
          </>
        )}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return apis.uploadAsset({
            path: filePath,
            file: fileRef.current.files[0]
          }).then(res => {
            if (res.status === 0) {
              setRefresh(+new Date());
              return '操作成功';
            }
            throw new Error(res.message);
          });
        }}
        okText="保存"
        okType="primary" />
    </div>
  );
};

export default File;
