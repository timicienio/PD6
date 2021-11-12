import React from 'react';
import {
  TextField, FormControl, Select, MenuItem,
} from '@material-ui/core';
import MultiSelect from './MultiSelect';

const SearchField = ({
  classes, tempFilterValue, setTempFilterValue, filterConfig, filteringIndex, onSearch,
}) => {
  // console.log(filterConfig[filteringIndex]);
  switch (filterConfig[filteringIndex].type) {
    case 'TEXT': {
      return (
        <TextField
          id="search"
          onChange={(e) => {
            setTempFilterValue(
              tempFilterValue.map((item, index) => (index === filteringIndex ? e.target.value : item)),
            );
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              onSearch();
            }
          }}
          value={tempFilterValue[filteringIndex]}
          placeholder="Search"
          className={classes.search}
        />
      );
    }
    case 'ENUM_SINGLE': {
      return (
        <FormControl variant="outlined">
          <Select
            className={classes.search}
            value={tempFilterValue[filteringIndex]}
            name="institute"
            onChange={(e) => {
              setTempFilterValue(
                tempFilterValue.map((item, index) => (index === filteringIndex ? e.target.value : item)),
              );
            }}
          >
            {filterConfig[filteringIndex].options.map((item) => (
              <MenuItem key={item} value={item.label}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
    case 'ENUM': {
      return (
        <MultiSelect
          className={classes.search}
          options={filterConfig[filteringIndex].options.map((item) => item.label)}
          value={tempFilterValue[filteringIndex]}
          setValue={(newValue) => {
            setTempFilterValue(tempFilterValue.map((item, index) => (index === filteringIndex ? newValue : item)));
          }}
        />
      );
    }
    // case 'DATE':{
    //   return
    // }
    default:
      return <div />;
  }
};

export default SearchField;
