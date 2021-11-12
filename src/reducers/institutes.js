import { combineReducers } from 'redux';
import { commonConstants } from '../actions/common/constant';
import { accountConstants } from '../actions/admin/constant';

const byId = (state = {}, action) => {
  switch (action.type) {
    case commonConstants.GET_INSTITUTE_SUCCESS: {
      return action.payload.reduce((acc, item) => ({ ...acc, [item.id]: { ...item } }), {});
    }

    case accountConstants.FETCH_INSTITUTE_SUCCESS: {
      return { ...state, [action.payload.id]: action.payload };
    }
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case commonConstants.GET_INSTITUTE_SUCCESS:
      return action.payload.map((item) => item.id);

    case accountConstants.FETCH_INSTITUTE_SUCCESS:
      return state.includes(action.payload.id) ? state : state.concat([action.payload.id]);

    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
