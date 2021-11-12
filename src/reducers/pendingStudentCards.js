import { combineReducers } from 'redux';
import { accountConstants } from '../actions/admin/constant';
import { userConstants } from '../actions/user/constants';

const byId = (state = {}, action) => {
  switch (action.type) {
    case accountConstants.BROWSE_PENDING_STUDENT_CARDS_SUCCESS: {
      const { data } = action.payload;
      return data.reduce((acc, item) => ({ ...acc, [item.id]: { ...item } }), {});
    }
    case userConstants.BROWSE_SELF_PENDING_STUDENT_CARDS_SUCCESS: {
      // const { data } = action.payload;
      return action.payload.reduce((acc, item) => ({ ...acc, [item.id]: { ...item } }), {});
    }
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case accountConstants.BROWSE_PENDING_STUDENT_CARDS_SUCCESS: {
      const { data } = action.payload;
      return data.map((item) => item.id);
    }
    case userConstants.BROWSE_SELF_PENDING_STUDENT_CARDS_SUCCESS: {
      // const { data } = action.payload;
      return action.payload.map((item) => item.id);
    }
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
