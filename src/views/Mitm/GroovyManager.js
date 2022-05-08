import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { SearchInput, OpeDialog } from "components";
import {
  Button,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem
} from "@material-ui/core";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import GetAppIcon from '@material-ui/icons/GetApp';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import CodeMirror from "@uiw/react-codemirror";

import Table from "./GroovyManagerTable";

import apis from "apis";

const useStyles = makeStyles(theme => ({
  row: {
    height: "42px",
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  dialogInput: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  btn: {
    marginRight: theme.spacing(1)
  }
}));

function Groovy() {
  const classes = useStyles();
  const [limit] = useState(10);

  const [editId, setEditId] = useState("");
  const [groovyText, setGroovyText] = useState("");
  const [groovyPriority, setGroovyPriority] = useState(0);
  const [groovyName, setGroovyName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [mitm, setMitm] = useState([]);
  const [refresh, setRefresh] = useState(+new Date());
  useEffect(() => {
    apis.listMitmScript({ page: 1, pageSize: 1000 }).then(res => {
      if (res.status === 0) {
        setMitm(res.data);
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
      </div>
      <div className={classes.row}>
        <Button
          startIcon={<GetAppIcon />}
          color="primary"
          className={classes.btn}
          variant="contained"
          onClick={() => {
            window.open("/malenia/system-info/downloadCaCertificate?pem=true");
          }}
        >
          下载ca证书
        </Button>
        <Button
          startIcon={<GetAppIcon />}
          color="primary"
          className={classes.btn}
          variant="contained"
          onClick={() => {
            window.open("/build-in-res/mitm-dsl-project.zip");
          }}
        >
          下载集成环境
        </Button>
        <Button
          startIcon={<MenuBookIcon />}
          color="primary"
          className={classes.btn}
          variant="contained"
          onClick={() => {
            window.open("/malenia-doc/01_user_manual/06_mitm.html");
          }}
        >
          参考文档
        </Button>
        <Button
          startIcon={<SpellcheckIcon />}
          color="primary"
          variant="contained"
          onClick={() => {
            setOpenDialog(true);
            setEditId("");
            setGroovyName("");
            setGroovyPriority(0);
            setGroovyText("");
          }}
        >
          添加 Groovy 脚本
        </Button>
      </div>
      <Table
        data={mitm.filter(item => JSON.stringify(item).includes(query))}
        rowsPerPage={limit}
        pageState={[page, setPage]}
        setRefresh={setRefresh}
        setEdit={(item) => {
          setOpenDialog(true);
          setEditId(item.id);
          setGroovyName(item.name);
          setGroovyPriority(item.priority);
          setGroovyText(item.content);
        }} />
      <OpeDialog
        title="添加 Groovy 脚本"
        opeContent={(
          <>
            <Grid
              container
              spacing={6}
              wrap="wrap"
            >
              <Grid item xs={12}>
                <Typography gutterBottom variant="h6">名字</Typography>
                <TextField
                  className={classes.dialogInput}
                  size="small"
                  variant="outlined"
                  value={groovyName}
                  onChange={(e) => setGroovyName(e.target.value)} />
                <Typography gutterBottom variant="h6">优先级</Typography>
                <Select
                  className={classes.dialogInput}
                  style={{ height: "40px" }}
                  variant="outlined"
                  value={groovyPriority}
                  onChange={(e) => {
                    setGroovyPriority(e.target.value);
                  }}
                >
                  {Array.from({ length: 10 }).map((d, index) => (
                    <MenuItem key={d + index} value={index}>
                      {index}
                    </MenuItem>
                  ))}
                </Select>
                <Typography gutterBottom variant="h6">内容</Typography>
                <CodeMirror
                  value={groovyText}
                  height="300px"
                  onChange={(value) => setGroovyText(value)}
                />
              </Grid>
            </Grid>
          </>
        )}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        doDialog={() => {
          return apis.addOrUpdateMitmScript({
            id: editId || undefined,
            name: groovyName,
            priority: groovyPriority,
            content: groovyText
          }).then(res => {
            if (res.status === 0) {
              setRefresh(+new Date());
              return "操作成功";
            }
            throw new Error(res.message);
          });
        }}
        okText="保存"
        okType="primary" />
    </div>
  );
};

export default Groovy;
