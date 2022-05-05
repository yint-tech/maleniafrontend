import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Collapse,
  IconButton,
  Box
} from '@material-ui/core';

import Empty from '../Empty';

const CollapseRow = (props) => {
  const { row, columns, renderCollapse } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {columns.map(col => (
          <TableCell key={col.label}>{typeof col.render === 'function' ? col.render(row) : row[col.key]}</TableCell>
        ))}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {renderCollapse(row)}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const DataTable = props => {
  let {
    data,
    columns,
    size = "medium",
    collapse = false,
    renderCollapse = () => (<></>),
    checkbox = false,
    checkedKey = '',
    checked = [],
    handleSelectAll = () => { },
    handleSelectOne = () => { },
    style = {}
  } = props;

  return (
    <PerfectScrollbar style={style}>
      <Table size={size}>
        <TableHead>
          <TableRow>
            {collapse ? (
              <TableCell />
            ) : null}
            {checkbox ? (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={checked.length === data.length}
                  color="primary"
                  indeterminate={
                    checked.length > 0 &&
                    checked.length < data.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
            ) : null}
            {columns.map(item => (
              <TableCell key={item.label}>{item.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => {
              if (collapse) {
                return (
                  <CollapseRow
                    key={String(index)}
                    row={row}
                    columns={columns}
                    renderCollapse={renderCollapse}
                  />)
              }
              return (
                <TableRow key={String(index)} hover>
                  {checkbox ? (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={checked.indexOf(row[checkedKey]) !== -1}
                        color="primary"
                        onChange={event => handleSelectOne(event, row[checkedKey])}
                        value="true"
                      />
                    </TableCell>
                  ) : null}
                  {columns.map(col => (
                    <TableCell key={col.label}>{typeof col.render === 'function' ? col.render(row) : row[col.key]}</TableCell>
                  ))}
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + (checkbox ? 1 : 0)}>
                <Empty text="暂无数据" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </PerfectScrollbar>
  );
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired
};

export default DataTable;
