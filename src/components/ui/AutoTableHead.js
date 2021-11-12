import React, { useState } from 'react';
import {
  Button, FormControl, Select, MenuItem,
} from '@material-ui/core';
import Icon from './icon/index';
import SearchField from './SearchField';

const AutoTableHead = ({
  hasFilter,
  classes,
  buttons,
  filterConfig,
  // filter,
  onSearch,
  onRefresh,
  hasRefreshButton,
}) => {
  const [tempFilterValue, setTempFilterValue] = useState(filterConfig.map((item) => (item.type === 'ENUM' ? [] : '')));
  const [filteringIndex, setFilteringIndex] = useState(0);
  // const [advanceSearchActivated, setAdvanceSearchActivated] = useState(false);

  const onClickSearch = () => {
    const { reduxStateId, operation } = filterConfig[filteringIndex];
    if (filterConfig[filteringIndex].type === 'ENUM') {
      // transformation from MultiSelect options (label) array to filter value array.
      // this will return the first option with the matching label
      const transformedTempFilterValue = tempFilterValue[filteringIndex].map(
        (optionLabel) => filterConfig[filteringIndex].options.filter((option) => option.label === optionLabel)[0].value,
      );
      onSearch([[reduxStateId, operation, transformedTempFilterValue]]);
    } else if (filterConfig[filteringIndex].type === 'ENUM_SINGLE') {
      const transformedTempFilterValue = filterConfig[filteringIndex].options.filter(
        (option) => option.label === tempFilterValue[filteringIndex],
      )[0].value;
      onSearch([[reduxStateId, operation, [transformedTempFilterValue]]]);
    } else {
      onSearch([[reduxStateId, operation, tempFilterValue[filteringIndex]]]);
    }
  };

  return (
    <div className={hasFilter ? classes.topContent1 : classes.topContent2}>
      {hasFilter && (
        <div className={classes.filterWrapper}>
          <div className={classes.searchFields}>
            <FormControl variant="outlined" style={{ flexShrink: 7 }}>
              <Select
                autoWidth
                className={classes.filterSelect}
                value={filteringIndex}
                onChange={(e) => {
                  setFilteringIndex(e.target.value);
                }}
              >
                {filterConfig.map((item, index) => (
                  <MenuItem key={item.label} value={index} className={classes.filterItem}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <SearchField
              tempFilterValue={tempFilterValue}
              setTempFilterValue={setTempFilterValue}
              classes={classes}
              filterConfig={filterConfig}
              filteringIndex={filteringIndex}
              onSearch={onClickSearch}
            />
          </div>
          <div className={classes.buttons}>
            <Button color="primary" onClick={onClickSearch} disabled={filterConfig[filteringIndex].type === 'DATE'}>
              <Icon.SearchIcon />
            </Button>
            <Button disabled>
              {/* TODO Advanced search */}
              <Icon.Advancedsearch className={classes.iconButtonIcon} />
            </Button>
          </div>
        </div>
      )}
      <div className={classes.buttons}>
        {buttons}
        {hasRefreshButton && (
          <Button color="primary" onClick={onRefresh} startIcon={<Icon.RefreshOutlinedIcon />}>
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
};

export default AutoTableHead;
