import { combineReducers } from 'redux';
import { problemConstants } from '../actions/myClass/constant';

const byId = (state = {}, action) => {
  switch (action.type) {
    case problemConstants.BROWSE_ASSISTING_DATA_SUCCESS: {
      const { problemId, assistingData } = action.payload;
      return assistingData.reduce((acc, item) => ({ ...acc, [item.id]: { ...item } }), state);
    }
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case problemConstants.BROWSE_ASSISTING_DATA_SUCCESS: {
      const { problemId, assistingData } = action.payload;
      return [...new Set([...assistingData.map((item) => item.id), ...state])];
    }
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
