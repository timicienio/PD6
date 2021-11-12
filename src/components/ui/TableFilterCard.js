import {
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core';

import React, { useState } from 'react';
import Icon from './icon/index';
import AlignedText from './AlignedText';

const useStyles = makeStyles(() => ({
  filterButton: {
    justifyContent: 'space-between',
  },
  selectField: {
    width: '350px',
  },
  clearButton: {
    marginLeft: '24px',
    backgroundColor: '#FFFFFF',
    border: 'solid',
    borderColor: '#DDDDDD',
  },
  filterIcon: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

export default function TableFilterCard({
  popUp, setPopUp, filterInput, filterOptions, setFilterInput, doFilter,
}) {
  const classes = useStyles();
  const [onFilter, setOnFilter] = useState(false);
  const [tempInput, setTempInput] = useState({
    filter: ['Select all'],
    sort: '(None)',
  });
  const filterClear = () => {
    setTempInput({
      filter: ['Select all'],
      sort: '(None)',
    });
  };

  const openFilter = () => {
    setTempInput(filterInput);
    setPopUp(true);
  };

  const saveFilter = () => {
    setFilterInput(tempInput);
    if (tempInput.filter[0] === 'Select all' && tempInput.sort === '(None)') {
      setOnFilter(false);
    } else {
      setOnFilter(true);
    }
    setPopUp(false);
    doFilter(tempInput);
  };

  const onChangeFilterInput = (e) => {
    if (e.target.value.length === 0) {
      setTempInput((input) => ({ ...input, filter: ['Select all'] }));
    } else if (e.target.value[e.target.value.length - 1] === 'Select all') {
      setTempInput((input) => ({ ...input, filter: ['Select all'] }));
    } else if (e.target.value[0] === 'Select all') {
      const newArr = e.target.value.slice(1);
      setTempInput((input) => ({ ...input, filter: newArr }));
    } else {
      setTempInput((input) => ({ ...input, filter: e.target.value }));
    }
  };

  return (
    <>
      {onFilter ? (
        <Icon.FilterSelected
          className={classes.filterIcon}
          onClick={() => {
            openFilter();
          }}
        />
      ) : (
        <Icon.FilterIdle
          className={classes.filterIcon}
          onClick={() => {
            openFilter();
          }}
        />
      )}
      <Dialog open={popUp} keepMounted onClose={() => setPopUp(false)} className={classes.popUpLayout}>
        <DialogContent>
          <AlignedText text="Filter by" childrenType="field">
            <FormControl variant="outlined" className={classes.selectField}>
              <Select
                labelId="status"
                id="status"
                value={tempInput.filter}
                onChange={(e) => {
                  onChangeFilterInput(e);
                }}
                multiple
              >
                <MenuItem value="Select all">Select all</MenuItem>
                {filterOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AlignedText>
          <AlignedText text="Sort by">
            <FormControl variant="outlined" className={classes.selectField}>
              <Select
                labelId="sort"
                id="sort"
                value={tempInput.sort}
                onChange={(e) => {
                  setTempInput((input) => ({ ...input, sort: e.target.value }));
                }}
              >
                <MenuItem value="(None)">(None)</MenuItem>
                <MenuItem value="A to Z">A to Z</MenuItem>
                <MenuItem value="Z to A">Z to A</MenuItem>
              </Select>
            </FormControl>
          </AlignedText>
        </DialogContent>
        <DialogActions className={classes.filterButton}>
          <div>
            <Button onClick={() => filterClear()} className={classes.clearButton}>
              Clear
            </Button>
          </div>
          <div>
            <Button onClick={() => setPopUp(false)} color="default">
              Cancel
            </Button>
            <Button
              onClick={() => {
                saveFilter();
              }}
              color="primary"
            >
              Save
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
