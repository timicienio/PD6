import React, { useState, useEffect } from 'react';
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
  IconButton,
  Snackbar,
  LinearProgress,
  Menu,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { autoTableMount, autoTableFlush } from '../../actions/component/autoTable';
import Icon from './icon/index';
import AutoTableHead from './AutoTableHead';

/* eslint react-hooks/exhaustive-deps: 0 */

// debug

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
    marginRight: '5px',
    width: 'auto',
    minWidth: '89px',
    flexShrink: 20,
  },
  searchFields: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexShrink: 27,
  },
  buttons: {
    marginTop: '3px',
    height: '60px',
    flexShrink: 0,
  },
  children: {
    margin: '16px 0px 50px 50px',
  },
  root: {
    width: '100%',
  },

  filterSelect: {
    marginRight: '10px',
    width: 'auto',
  },
  filterItem: {
    minWidth: '180px',
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
    height: 'inherit',
    padding: '7px 0px',
    background: 'white',
    borderBottomWidth: '1px',
    borderBottomColor: theme.palette.grey.A400,
  },
  progressContainer: {
    height: 0,
    overflow: 'visible',
  },
  progress: {
    height: 3,
    zIndex: 1000,
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
  bottomWrapper: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '15px',
    background: theme.palette.background.default,
    justifyContent: 'space-between',
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  textLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.hover,
    },
    '&:active': {
      color: theme.palette.primary.dark,
    },
  },
  toggleButtonIcon: {
    height: '20px',
    width: '20px',
  },
  arrowIcon: {
    height: '35px',
    margin: 'auto',
  },
  filterWrapper: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
  },
  sortIcon: {
    marginLeft: '5px',
    verticalAlign: 'middle',
    cursor: 'pointer',
  },
  activeSortIcon: {
    backgroundColor: theme.palette.black.main,
    color: 'white',
    borderRadius: '10px',
    padding: '2px',
    width: '20px',
    height: '20px',
  },
  sortDropdownContent: {
    position: 'relative',
    backgroundColor: theme.palette.primary.contrastText,
    left: '30px',
    width: '100px',
    zIndex: '1',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
    borderRadius: '10px',
    '& span': {
      color: theme.palette.black.main,
      padding: '12px',
      textDecoration: 'none',
      textAlign: 'center',
      display: 'block',
      '&:nth-child(1)': {
        borderRadius: '10px 10px 0 0',
      },
      '&:last-child': {
        borderRadius: '0 0 10px 10px',
      },
    },
    '& span:hover': {
      cursor: 'pointer',
      backgroundColor: theme.palette.grey.A100,
    },
  },
  selectedDirection: {
    backgroundColor: theme.palette.grey[300],
  },
  default: { color: theme.palette.black.dark },
  accepted: { color: theme.palette.green.main },
  error: { color: theme.palette.secondary.main },
  primary: { color: theme.palette.primary.main },
}));

const itemsPerPage = [10, 25, 50, 100];

function AutoTable({
  ident, // unique identifier for this table, used in dynamic redux state
  hasFilter, // display filter in table head
  filterConfig, // configuration of filter
  /*
  example value:
  [
    {
      reduxStateId: 'username',
      label: 'Username',
      type: 'TEXT',
      operation: 'LIKE',
    },
    {
      reduxStateId: 'role',
      label: 'Role',
      type: 'ENUM_SINGLE',
      options: [{value: 'MANAGER', label: 'Manager'}, {value: 'MEMBER', label: 'Member'}, {value: 'GUEST', label: 'Guest'}],
      operation: 'IN',
    },
    {
      reduxStateId: 'role',
      label: 'Role',
      type: 'ENUM',
      options: [{value: 'MANAGER', label: 'Manager'}, {value: 'MEMBER', label: 'Member'}, {value: 'GUEST', label: 'Guest'}],
      operation: 'IN',
    },
    {
      reduxStateId: 'start_time',
      label: 'Start Time',
      type: 'DATE',
      operation: 'BETWEEN'
    }
  ],
  */
  defaultSort = null,
  refetch, // function to call when table change page / filter / sort / clicked Refresh
  /*
  example value:
    (browseConfig, ident) => dispatch(fetchClassMembers(authToken, classId, browseParams: {limit, offset, filters, sorts}, ident))

  (ident, browseParams) are required parameters
  */
  refetchErrors = [], // boolean if there's problem in refetch
  columns, // configurations of columns
  /*
  example value:
  [
    {
      name: 'Institute',
      align: 'center',
      type: 'string',
    },
    {
      name: 'Email',
      align: 'center',
      type: 'string',
    },
  ];
  */
  reduxData,
  reduxDataToRows,
  hasLink = false,
  buttons = null,
  refreshLoadings = null, // refresh when any of the array elements turned from true to false
  hasRefreshButton = false,
}) {
  const classes = useStyles();
  const [curPage, setCurPage] = useState(0); // curPage * rowsPerPage = offset
  const [pageInput, setPageInput] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // limit

  const [filter, setFilter] = useState([]);
  const [sort, setSort] = useState([]);
  const [order, setOrder] = useState({ key: '', order: 'asc' }); // use by TableSortLabel

  const [displayedRange, setDisplayedRange] = useState([]);
  const [displayedReduxData, setDisplayedReduxData] = useState([]);
  const [rowData, setRowData] = useState([]);

  const [dataComplete, setDataComplete] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  // const allStates = useSelector((state) => state);
  const tableState = useSelector((state) => state.component.autoTable);

  // page change from button
  const handleChangePage = (event, newPage) => {
    if (newPage + 1 <= Math.ceil(tableState.byId[ident].totalCount / rowsPerPage) && newPage >= 0) {
      setPageInput(newPage + 1);
    }
  };

  // refresh
  const onRefresh = () => {
    dispatch(autoTableFlush(ident));
    setDataComplete(false);
    setCurPage(0);
    setPageInput('1');
  };

  // change filter
  const onSearch = (newFilter) => {
    if (tableState.byId[ident]) {
      dispatch(autoTableFlush(ident));
      setFilter(newFilter);
      setDataComplete(false);
      setCurPage(0);
      setPageInput('1');
    }
  };

  const calculateTotalNumOfPages = () => {
    if (tableState.byId[ident]) {
      if (tableState.byId[ident].totalCount === Infinity) return 0;
      return Math.ceil(tableState.byId[ident].totalCount / rowsPerPage);
    }
    return 100;
  };

  const onSort = (key, sortDirection) => {
    setOrder({ key, order: sortDirection });
    setSort([[key, sortDirection.toUpperCase()]]);

    setDataComplete(false);
  };

  // page change from input
  useEffect(() => {
    if (
      tableState.byId[ident]
      && Number(pageInput) <= Math.ceil(tableState.byId[ident].totalCount / rowsPerPage)
      && pageInput >= 1
    ) {
      setCurPage(Number(pageInput) - 1);
    } else if (tableState.byId[ident]) {
      if (Number(curPage) > Math.ceil(tableState.byId[ident].totalCount / rowsPerPage)) {
        setPageInput(String(Math.ceil(tableState.byId[ident].totalCount / rowsPerPage)));
      }
    } else {
      setPageInput('1');
    }
  }, [ident, pageInput, rowsPerPage, tableState]);

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setCurPage(0); // TODO: calculate this
  // };

  // const labelMoveLeft = (icon, cols, col) => {
  //   if (icon && icon[cols.findIndex((x) => x.id === col.id)]) {
  //     return classes.columnLabelMoveLeft;
  //   }
  //   return classes.columnLabelDefault;
  // };

  // table mount, create dynamic redux state
  useEffect(() => {
    if (tableState.byId[ident] === undefined) {
      dispatch(autoTableMount(ident));
      // set defaultSort
      if (defaultSort) {
        setOrder({ key: defaultSort[0][0], order: defaultSort[0][1].toLowerCase() });
      }
    }
  }, [ident]);

  useEffect(() => {
    if (refreshLoadings) {
      setIsLoading(refreshLoadings.reduce((acc, item) => acc || item, false));
    }
  }, [refreshLoadings]);

  useEffect(() => {
    if (!isLoading) {
      onRefresh();
    }
  }, [isLoading]);

  useEffect(() => {
    if (tableState.byId[ident]) {
      if (Number(curPage) > Math.ceil(tableState.byId[ident].totalCount / rowsPerPage)) {
        setCurPage(Math.ceil(tableState.byId[ident].totalCount / rowsPerPage));
      }
    }
  }, [tableState.byId[ident], curPage, rowsPerPage]);

  useEffect(() => {
    setDisplayedRange(
      Array.from(
        {
          length: rowsPerPage,
        },
        (_, id) => id + rowsPerPage * curPage,
      ),
    );
  }, [rowsPerPage, curPage]);

  // switch page
  useEffect(() => {
    if (tableState.byId[ident]) {
      const newDisplayedReduxData = displayedRange
        .filter((id) => id < tableState.byId[ident].totalCount)
        .map((id) => tableState.byId[ident].displayedDataIds.get(id))
        .map((id) => reduxData.byId[id]);

      setDataComplete(newDisplayedReduxData.reduce((acc, item) => acc && item !== undefined, true));
      setDisplayedReduxData(newDisplayedReduxData);
    }
  }, [curPage, displayedRange, ident, reduxData.byId, tableState.byId]);
  // table refetch
  useEffect(() => {
    // remove ['something', '=', '']
    const adjustFilter = (oriFilter) => oriFilter.filter((item) => !(item[1] === '=' && item[2] === ''));

    if (!dataComplete) {
      // console.log('refetch', ident);

      refetch(
        {
          limit: rowsPerPage,
          offset: curPage * rowsPerPage,
          filter: adjustFilter(filter),
          sort: defaultSort ? [...sort, defaultSort] : sort,
        },
        ident,
      );
    }
  }, [dataComplete, curPage, filter, ident, rowsPerPage, sort]);

  // refetch done
  useEffect(() => {
    if (dataComplete) {
      setRowData(displayedReduxData.map((item) => reduxDataToRows(item)));
    }
  }, [dataComplete, displayedReduxData, reduxDataToRows]);

  // there is refetch error
  useEffect(() => {
    setIsError(refetchErrors.reduce((acc, item) => acc || !!item, false));
  }, [refetchErrors]);

  // refetch error
  useEffect(() => {
    if (isError) {
      setRowData(
        displayedReduxData.map((item) => (item ? reduxDataToRows(item) : columns.reduce((acc, col) => ({ ...acc, [col.name]: '' }), {}))),
      );
    }
  }, [refetchErrors, displayedReduxData]);

  const [anchorEls, setAnchorEls] = useState([]);

  const handleSortIconClick = (event, index) => {
    const temp = columns.map(() => null);
    temp[index] = event.target;
    setAnchorEls(temp);
  };

  const handleClose = () => {
    setAnchorEls(columns.map(() => null));
  };

  return (
    <>
      <AutoTableHead
        hasFilter={hasFilter}
        classes={classes}
        buttons={buttons}
        filterConfig={filterConfig}
        filter={filter}
        onSearch={onSearch}
        onRefresh={onRefresh}
        hasRefreshButton={hasRefreshButton}
      />
      <div className={classes.progressContainer}>
        {dataComplete || isError || <LinearProgress color="primary" className={classes.progress} />}
      </div>
      <Paper className={classes.root} elevation={0}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell className={`${classes.tableHeadCell} ${classes.tableRowContainerLeftSpacing}`} />
                {columns.map((column, index) => (
                  <React.Fragment key={column.name}>
                    <TableCell className={`${classes.tableHeadCell} ${classes.tableColumnLeftSpacing}`} />
                    <TableCell
                      align={column.align}
                      className={classes.tableHeadCell}
                      style={{
                        minWidth: column.minWidth,
                        width: column.width,
                        maxWidth: column.width,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <b>{column.name}</b>
                      {column.sortable && (
                        <div>
                          <Icon.Sort
                            className={
                              order.key === column.sortable
                                ? `${classes.sortIcon} ${classes.activeSortIcon}`
                                : classes.sortIcon
                            }
                            id={`sort-icon-${column.name}`}
                            aria-controls={`sort-menu-${column.name}`}
                            aria-haspopup="true"
                            onClick={(e) => handleSortIconClick(e, index)}
                          />
                          <Menu
                            id={`sort-menu-${column.name}`}
                            aria-labelledby={`sort-icon-${column.name}`}
                            anchorEl={anchorEls[index]}
                            open={Boolean(anchorEls[index])}
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                          >
                            <MenuItem
                              onClick={() => {
                                handleClose();
                                onSort(column.sortable, 'asc');
                              }}
                              className={
                                order.key === column.sortable && order.order === 'asc' ? classes.selectedDirection : ''
                              }
                            >
                              A to Z
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                handleClose();
                                onSort(column.sortable, 'desc');
                              }}
                              className={
                                order.key === column.sortable && order.order === 'desc' ? classes.selectedDirection : ''
                              }
                            >
                              Z to A
                            </MenuItem>
                          </Menu>
                        </div>
                      )}
                    </TableCell>
                  </React.Fragment>
                ))}
                <TableCell
                  key={hasLink ? 'link' : 'blank'}
                  align="right"
                  className={classes.tableHeadCell}
                  style={{ minWidth: 20, width: '100%' }}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {
                /* TODO
              if => switch
              column.type: 'text', 'number', 'link', 'date'
              */
                rowData.map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className={classes.row}>
                    <TableCell key={`${row.id}-left`} className={classes.tableRowContainerLeftSpacing} />
                    {columns.map((column) => {
                      const value = row[column.name];
                      if (column.type === 'link') {
                        return (
                          <React.Fragment key={`${row.id}-${column.name}`}>
                            <TableCell className={classes.tableColumnLeftSpacing} />
                            <TableCell
                              className={`${classes.tableBodyCell} ${classes.textLink}`}
                              style={{ minWidth: column.minWidth, width: column.width, maxWidth: column.width }}
                              align={column.align}
                            >
                              <Link to={value.path} className={classes.textLink}>
                                {column.format && typeof value.text === 'number'
                                  ? column.format(value.text)
                                  : value.text}
                              </Link>
                            </TableCell>
                          </React.Fragment>
                        );
                      }
                      return (
                        <React.Fragment key={`${row.id}-${column.name}`}>
                          <TableCell className={classes.tableColumnLeftSpacing} />
                          <TableCell
                            align={column.align}
                            className={`${column.colors && column.colors[value] && classes[column.colors[value]]} ${
                              classes.tableBodyCell
                            }`}
                            style={{ minWidth: column.minWidth, width: column.width, maxWidth: column.width }}
                          >
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        </React.Fragment>
                      );
                    })}
                    {hasLink ? (
                      <TableCell key={`${row.id}-show`} align="right">
                        <Link to={row.link} className={classes.detailLink}>
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
        <div className={classes.bottomWrapper}>
          <div />
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
                {itemsPerPage.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
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
                const newInput = e.target.value;
                if (tableState.byId[ident] && Number(newInput) <= calculateTotalNumOfPages() && Number(newInput) >= 1) {
                  setPageInput(newInput);
                  setCurPage(Number(pageInput) - 1);
                } else if (newInput === '') {
                  setPageInput(newInput);
                }
              }}
            />
            <Typography className={classes.pageText} variant="body1">
              {`of ${calculateTotalNumOfPages()}`}
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
        </div>
      </Paper>
      <Snackbar
        severity="error"
        open={isError}
        autoHideDuration={6000}
        message={`Error refetching data: ${
          Boolean(refetchErrors.filter((error) => !!error)[0])
            ? refetchErrors.filter((error) => !!error)[0].toString()
            : ''
        }`}
      />
    </>
  );
}

export default AutoTable;
