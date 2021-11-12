import { combineReducers } from 'redux';
import { systemConstants } from '../actions/admin/constant';
import { commonConstants } from '../actions/common/constant';

const byId = (state = {}, action) => {
  switch (action.type) {
    case systemConstants.FETCH_SUBMIT_LANGUAGE_SUCCESS: {
      const { data } = action.payload;
      return data.reduce((acc, item) => ({ ...acc, [item.id]: { ...item } }), state.submitLang);
    }
    case systemConstants.EDIT_SUBMIT_LANGUAGE_SUCCESS: {
      const { data } = action.payload;
      return { ...state.submitLang.byId, [data.id]: action.payload };
    }
    case commonConstants.BROWSE_SUBMISSION_LANG_SUCCESS:
      return action.payload.reduce((acc, item) => ({ ...acc, [item.id]: { ...item } }), state.submitLang);
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case systemConstants.FETCH_SUBMIT_LANGUAGE_SUCCESS: {
      const { data } = action.payload;
      return data.map((item) => item.id);
    }
    case commonConstants.BROWSE_SUBMISSION_LANG_SUCCESS:
      return action.payload.map((item) => item.id);
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
