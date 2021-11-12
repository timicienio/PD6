import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from './icon/index';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    overflowX: 'hide',
  },
  topContent: {
    background: theme.palette.grey.A100,
    borderRadius: '10px 10px 0px 0px',
    padding: '5px 15px 5px 15px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  hide: {
    display: 'none',
  },
  tableHead: {
    height: '45px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: theme.palette.grey.A400,
  },
  column: {
    display: 'flex',
    justifyContent: 'center',
  },
  row: {
    height: '60px',
  },
  textLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
  tableHeadCell: {
    height: '45px',
    padding: '0px',
    background: 'white',
    borderBottomWidth: '1px',
    borderBottomColor: theme.palette.grey.A400,
    minWidth: '20px',
  },
  tableBodyCell: {
    whiteSpace: 'pre',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  editTableCell: {
    paddingTop: '7.5px',
    paddingBottom: '7.5px',
  },
  editField: {
    width: '150px',
    height: '45px',
    margin: '0px',
  },
  flexibleEditField: {
    margin: '0px',
    width: '100%',
    minWidth: '75px',
  },
  deleteCell: {
    padding: '15px',
    minWidth: '65.8px',
  },
  deleteIcon: {
    height: '30px',
    width: '30px',
    padding: '6px',
    borderRadius: '15px',
    '&:hover': {
      cursor: 'pointer',
      background: theme.palette.grey.A100,
    },
    '&:active': {
      cursor: 'pointer',
      background: theme.palette.grey[300],
    },
  },
  default: { color: theme.palette.black.dark },
  error: { color: theme.palette.secondary.main },
  primary: { color: theme.palette.primary.main },
  accepted: { color: theme.palette.green.main },
}));

export default function SimpleTable({
  isEdit, hasDelete, buttons, columns, data, setData,
}) {
  const classes = useStyles();
  const [filterData, setFilterData] = useState(data);

  useEffect(() => {
    setFilterData(data);
  }, [columns, data]);

  const handleChange = (newItem) => {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === newItem.id) {
        data.splice(i, 1, newItem);
        break;
      }
    }
    const newData = [...data];
    if (isEdit) {
      setData(newData);
    }
    setFilterData(newData);
  };

  const handleDelete = (e, rowID) => {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].id === rowID) {
        data.splice(i, 1);
        break;
      }
    }
    const newData = [...data];
    if (isEdit) {
      setData(newData);
    }
    setFilterData(newData);
  };

  return (
    <>
      <div className={isEdit && buttons ? classes.topContent : classes.hide}>
        <div className={classes.buttons}>{buttons}</div>
      </div>
      <Paper className={classes.root} elevation={0}>
        <TableContainer>
          <Table>
            <TableHead className={classes.tableHead}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      width: column.width,
                      maxWidth: column.width,
                      border: 'none',
                      paddingTop: 0,
                      paddingBottom: 0,
                    }}
                  >
                    <div className={classes.column}>
                      <b>{column.label}</b>
                    </div>
                  </TableCell>
                ))}
                <TableCell
                  key="delete"
                  align="right"
                  className={isEdit && hasDelete ? classes.tableHeadCell : classes.hide}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {filterData.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className={classes.row}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    if (isEdit) {
                      if (column.editType === 'input' || column.editType === 'flexibleInput') {
                        return (
                          <TableCell key={column.id} className={classes.editTableCell}>
                            <TextField
                              className={column.editType === 'input' ? classes.editField : classes.flexibleEditField}
                              multiline={column.editType === 'flexibleInput'}
                              value={value}
                              onChange={(e) => {
                                const temp = { ...row };
                                temp[column.id] = e.target.value;
                                handleChange(temp);
                              }}
                            />
                          </TableCell>
                        );
                      }
                      if (column.editType === 'dropdown') {
                        return (
                          <TableCell key={column.id} className={classes.editTableCell}>
                            <FormControl variant="outlined" className={classes.editField}>
                              <Select
                                className={classes.editField}
                                labelId="value-selection"
                                id="value-selection"
                                value={value}
                                onChange={(e) => {
                                  const temp = { ...row };
                                  temp[column.id] = e.target.value;
                                  handleChange(temp);
                                }}
                              >
                                {column.dropdownList.map((item) => (
                                  <MenuItem key={item} value={item}>
                                    {item}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                        );
                      }
                    }
                    if (column.type === 'link') {
                      const link = row[column.link_id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className={`${classes.tableBodyCell} ${classes.textLink}`}
                          style={{
                            minWidth: column.minWidth,
                            width: column.width,
                            maxWidth: column.width,
                          }}
                        >
                          <Link to={link} className={classes.textLink}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </Link>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        className={`${column.colors && column.colors[value] && classes[column.colors[value]]} ${
                          classes.tableBodyCell
                        }`}
                        style={{
                          minWidth: column.minWidth,
                          width: column.width,
                          maxWidth: column.width,
                        }}
                      >
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  <TableCell
                    key={`${row.id}-deleteIcon`}
                    className={isEdit && hasDelete ? classes.deleteCell : classes.hide}
                    align="right"
                  >
                    <Icon.Trash
                      className={classes.deleteIcon}
                      onClick={(e) => {
                        handleDelete(e, row.id);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
