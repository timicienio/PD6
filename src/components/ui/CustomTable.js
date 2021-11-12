import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputAdornment,
  IconButton,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from './icon/index';

const useStyles = makeStyles((theme) => ({
  topContent1: {
    background: theme.palette.grey.A100,
    borderRadius: '10px 10px 0px 0px',
    padding: '5px 15px 15px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    height: '75px',
  },
  topContent2: {
    background: theme.palette.grey.A100,
    borderRadius: '10px 10px 0px 0px',
    padding: '5px 15px 15px 15px',
    display: 'flex',
    justifyContent: 'flex-end',
    height: '75px',
  },
  search: {
    height: '60px',
    width: 300,
  },
  search2: {
    height: '60px',
    width: 380,
  },
  search3: {
    height: '60px',
    width: 550,
    marginLeft: '5px',
  },
  buttons: {
    marginTop: '3px',
    height: '60px',
  },
  children: {
    margin: '16px 0px 50px 50px',
  },
  root: {
    width: '100%',
  },
  tableRowContainerLeftSpacing: {
    width: '15px',
    padding: '0px',
  },
  tableColumnLeftSpacing: {
    width: '10px',
    padding: '0px',
  },
  tableHeadCell: {
    height: '45px',
    padding: '0px',
    background: 'white',
    borderBottomWidth: '1px',
    borderBottomColor: theme.palette.grey.A400,
    width: 'fit-content',
  },
  column: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  columnLabelMoveLeft: {
    transform: 'translateX(-5px)',
  },
  columnLabelDefault: {
    transform: 'translateX(0px)',
  },
  columnComponent: {
    transform: 'translateX(5px) translateY(2px)',
  },
  row: {
    height: '60px',
  },
  tableBodyCell: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  bottom: {
    height: '75px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '15px',
    background: theme.palette.background.default,
  },
  pageChangeButtons: {
    width: '70px',
    paddingTop: '11.5px',
  },
  pageRowSelect: {
    width: '100px',
    height: '50px',
    margin: '0px 5px 5px 5px',
  },
  pageText: {
    margin: '0px 5px 0px 5px',
  },
  pageIndexTextField: {
    width: '100px',
    height: '45px',
    margin: '0px 5px 0px 5px',
  },
  detailLink: {
    color: 'black',
  },
  toggleButtonIcon: {
    height: '20px',
    width: '20px',
  },
  arrowIcon: {
    height: '35px',
    margin: 'auto',
  },
  textLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}));

// const tableRefetch = (limit, offset, filters, sorts) => dispatch(action(authToken, problemId, limit, offset, filter, sort))

// TODO: new API

// hasSearch,
// tableRefetch,
// buttons,
// columns,
// data,
// hasLink,
// linkName,
// children,

export default function CustomTable({
  hasSearch,
  // searchWidthOption = 1, // will remove
  // searchPlaceholder, // will remove
  buttons,
  columns,
  // columnComponent, // will remove
  data,
  hasLink,
  linkName,
  children,
}) {
  const classes = useStyles();
  const [curPage, setPage] = useState(0);
  const [pageInput, setPageInput] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filterData, setFilterData] = useState(data);

  const handleChangePage = (event, newPage) => {
    if (newPage + 1 <= Math.ceil(filterData.length / rowsPerPage) && newPage >= 0) {
      setPageInput(newPage + 1);
    }
  };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  // const searchWidth = (searchWidthOptions) => {
  //   switch (searchWidthOptions) {
  //     case 1:
  //       return classes.search;
  //     case 2:
  //       return classes.search2;
  //     case 3:
  //       return classes.search3;
  //     default:
  //       return classes.search;
  //   }
  // };

  // const labelMoveLeft = (icon, cols, col) => {
  //   if (icon && icon[cols.findIndex((x) => x.id === col.id)]) {
  //     return classes.columnLabelMoveLeft;
  //   }
  //   return classes.columnLabelDefault;
  // };

  // TODO: table refetch
  // useEffect(()=>{
  //   tableRefetch(limit, offset, filter, sort)
  // }, [limit, offset, filter, sort])

  useEffect(() => {
    if (pageInput <= Math.ceil(filterData.length / rowsPerPage) && pageInput >= 1) {
      setPage(pageInput - 1);
    }
  }, [filterData.length, pageInput, rowsPerPage]);

  useEffect(() => {
    // if (search !== '') {
    //   const newData = data.filter((row) => {
    //     let cnt = 0;
    //     columns.forEach((column) => {
    //       if (row[column.id].indexOf(search) >= 0) {
    //         cnt += 1;
    //       }
    //     });
    //     return cnt > 0;
    //   });
    //   setFilterData(newData);
    // } else {
    //   setFilterData(data);
    // }
    setFilterData(data);
  }, [columns, data, search]);

  return (
    <>
      {/*
      TODO: Table head component

      props:

      filtersConfig: [
        {column: 'Name', type: 'TextField', options:null, operation: 'LIKE'},
        {column: 'Role', type: 'Dropdown' options:['a', 'b', 'c'], operation: 'IN'},
        {column: 'Start Time', type: 'Date', options: null, operation: 'BETWEEN'}],
      filters: [['Start Time', 'LIKE', 'something'], ['Name', 'IN', ['b', 'c']], ['Start Time', 'BETWEEN', ['2021-08-16T14:21:54Z', '2021-08-16T14:21:54Z']]]
      setFilters,
      buttons,
      */}

      <div className={hasSearch ? classes.topContent1 : classes.topContent2}>
        {hasSearch && (
          <TextField
            id="search"
            // className={searchWidth(searchWidthOption)}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search}
            placeholder={"This doesn't work."}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Icon.SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        <div className={classes.buttons}>{buttons}</div>
      </div>

      <Paper className={classes.root} elevation={0}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <React.Fragment key={`${column.id}-${column.label}`}>
                    <TableCell
                      align={column.align}
                      className={classes.tableHeadCell}
                      style={{ minWidth: column.minWidth, width: column.width, maxWidth: column.width }}
                    >
                      <b>{column.label}</b>
                      {/* <div className={classes.column}>
                        <div className={labelMoveLeft(columnComponent, columns, column)}>
                          <b>{column.label}</b>
                        </div>
                        <div className={classes.columnComponent}>
                          {columnComponent && columnComponent[columns.findIndex((x) => x.id === column.id)]}
                        </div>
                      </div> */}
                    </TableCell>
                  </React.Fragment>
                ))}

                <TableCell
                  key={hasLink ? 'link' : 'blank'}
                  align="right"
                  className={classes.tableHeadCell}
                  style={{ minWidth: 20 }}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {
                /* TODO
              if => switch
              column.type: 'text', 'number', 'link', 'date'
              */
                filterData.slice(curPage * rowsPerPage, curPage * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className={classes.row}>
                    {columns.map((column) => {
                      if (column.type === 'link') {
                        const link = row[column.link_id];
                        const value = row[column.id];
                        return (
                          <React.Fragment key={`${column.id}-${column.label}`}>
                            <TableCell
                              className={`${classes.tableBodyCell} ${classes.textLink}`}
                              style={{ minWidth: column.minWidth, width: column.width, maxWidth: column.width }}
                              align={column.align}
                            >
                              {column.isExternal ? (
                                <a href={link} className={classes.textLink} target="_blank" rel="noreferrer noopener">
                                  {column.format && typeof value === 'number' ? column.format(value) : value}
                                </a>
                              ) : (
                                <Link to={link} className={classes.textLink}>
                                  {column.format && typeof value === 'number' ? column.format(value) : value}
                                </Link>
                              )}
                            </TableCell>
                          </React.Fragment>
                        );
                      }
                      const value = row[column.id];
                      return (
                        <React.Fragment key={`${column.id}-${column.label}`}>
                          <TableCell
                            className={classes.tableBodyCell}
                            style={{ minWidth: column.minWidth, width: column.width, maxWidth: column.width }}
                            align={column.align}
                          >
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        </React.Fragment>
                      );
                    })}
                    {hasLink ? (
                      <TableCell key={`${row.id}-show`} align="right">
                        <Link to={row[linkName]} className={classes.detailLink}>
                          <IconButton>
                            <Icon.ArrowForwardRoundedIcon className={classes.toggleButtonIcon} />
                          </IconButton>
                        </Link>
                      </TableCell>
                    ) : (
                      <TableCell key={`${row.id}-blank`} align="right" style={{ minWidth: 20 }} />
                    )}
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <div className={classes.bottom}>
          <FormControl variant="outlined">
            <Select
              className={classes.pageRowSelect}
              labelId="rows-per-page"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(e.target.value);
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>

          <Typography className={classes.pageText} variant="body1">
            rows
          </Typography>
          <Button
            className={classes.pageChangeButtons}
            onClick={(e) => {
              handleChangePage(e, curPage - 1);
            }}
          >
            <Icon.ChevronLeftOutlinedIcon className={classes.arrowIcon} />
          </Button>
          <TextField
            className={classes.pageIndexTextField}
            value={pageInput}
            onChange={(e) => {
              setPageInput(e.target.value);
            }}
          />
          <Typography className={classes.pageText} variant="body1">
            of
            {' '}
            {Math.ceil(filterData.length / rowsPerPage)}
          </Typography>
          <Button
            className={classes.pageChangeButtons}
            onClick={(e) => {
              handleChangePage(e, curPage + 1);
            }}
          >
            <Icon.ChevronRightOutlinedIcon className={classes.arrowIcon} />
          </Button>
        </div>
      </Paper>
      <div className={classes.children}>{children}</div>
    </>
  );
}
