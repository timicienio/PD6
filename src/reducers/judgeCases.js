import { combineReducers } from 'redux';
import { judgementConstants } from '../actions/api/constant';

const prototype = {
  id: null,
  judgement_id: null,
  testcase_id: null,
  verdict: null,
  time_lapse: null,
  peak_memory: null,
  score: null,
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case judgementConstants.BROWSE_ALL_JUDGEMENT_JUDGE_CASE_SUCCESS: {
      const { judgeCases } = action.payload.data;

      return judgeCases.reduce(
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
    case judgementConstants.BROWSE_ALL_JUDGEMENT_JUDGE_CASE_SUCCESS: {
      const { judgeCases } = action.payload.data;
      return [...new Set([...state, ...judgeCases.map((item) => item.id)])];
    }

    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
