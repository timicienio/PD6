import { combineReducers } from 'redux';
import { gradeConstants } from '../actions/myClass/constant';
import { viewConstants } from '../actions/api/constant';

const byId = (state = {}, action) => {
  switch (action.type) {
    case gradeConstants.FETCH_GRADE_SUCCESS: {
      const { gradeId, data } = action.payload;
      return { ...state, [gradeId]: { ...data } };
    }

    case viewConstants.BROWSE_CLASS_GRADE_SUCCESS:
    case gradeConstants.FETCH_ACCOUNT_GRADE_SUCCESS: {
      const { data } = action.payload;
      return data.reduce((acc, item) => ({ ...acc, [item.id]: { ...item } }), state);
    }

    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case gradeConstants.FETCH_GRADE_SUCCESS: {
      const { data } = action.payload;
      return [...new Set([...state, data.id])];
    }

    case viewConstants.BROWSE_CLASS_GRADE_SUCCESS:
    case gradeConstants.FETCH_ACCOUNT_GRADE_SUCCESS: {
      const { data } = action.payload;
      return [...new Set([...state, ...data.map((item) => item.id)])];
    }

    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
