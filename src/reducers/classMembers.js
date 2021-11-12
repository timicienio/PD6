import { combineReducers } from 'redux';
import { commonConstants } from '../actions/common/constant';
import { viewConstants } from '../actions/api/constant';

const prototype = {
  id: null,
  account_id: null,
  class_id: null,
  role: null,
  institute_abbreviated_name: null,
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case viewConstants.BROWSE_CLASS_MEMBER_SUCCESS:
    case commonConstants.FETCH_CLASS_MEMBER_WITH_ACCOUNT_REFERRAL_SUCCESS: {
      const { classMembers } = action.payload.data;

      return classMembers.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: {
            ...prototype,
            ...state[item.id],
            ...item,
          },
        }),
        state,
      );
    }
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case viewConstants.BROWSE_CLASS_MEMBER_SUCCESS:
    case commonConstants.FETCH_CLASS_MEMBER_WITH_ACCOUNT_REFERRAL_SUCCESS: {
      const { classMembers } = action.payload.data;
      return [...new Set([...classMembers.map((item) => item.id), ...state])];
    }
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
