import { combineReducers } from 'redux';
import { systemConstants } from '../actions/admin/constant';

const byId = (state = {}, action) => {
  switch (action.type) {
    case systemConstants.FETCH_ANNOUNCEMENT_SUCCESS: {
      const { data } = action.payload;
      // console.log('reducer :', data.reduce((acc, item) => ({ ...acc, [item.id]: { ...item } }), state));
      return data.reduce((acc, item) => ({ ...acc, [item.id]: { ...item } }), state);
    }
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case systemConstants.FETCH_ANNOUNCEMENT_SUCCESS: {
      const { data } = action.payload;
      return data.map((item) => item.id);
    }
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
