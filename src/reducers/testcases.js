import { combineReducers } from 'redux';
import { problemConstants, submissionConstants } from '../actions/myClass/constant';

const prototype = {
  id: null,
  problem_id: null,
  is_sample: false,
  score: null,
  label: null,
  input_file_uuid: null,
  output_file_uuid: null,
  input_filename: null,
  output_filename: null,
  input: null, // input content
  output: null, // output content
  note: null,
  time_limit: null,
  memory_limit: null,
  is_disabled: true,
  is_deleted: false,
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case problemConstants.FETCH_TESTCASE_UNDER_PROBLEM_SUCCESS: {
      const { testcases } = action.payload;
      return testcases.reduce((acc, item) => ({ ...acc, [item.id]: { ...prototype, ...item } }), state);
    }
    case problemConstants.BROWSE_TESTCASES_SUCCESS: {
      const { testcases } = action.payload;
      return testcases.reduce((acc, item) => ({ ...acc, [item.id]: { ...prototype, ...item } }), state);
    }
    case submissionConstants.BROWSE_TESTCASES_SUCCESS: {
      const { testcases } = action.payload;
      return testcases.reduce((acc, item) => ({ ...acc, [item.id]: { ...prototype, ...item } }), state);
    }
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case problemConstants.FETCH_TESTCASE_UNDER_PROBLEM_SUCCESS: {
      const { testcases } = action.payload;
      return [...new Set([...testcases.map((item) => item.id), ...state])];
    }
    case problemConstants.BROWSE_TESTCASES_SUCCESS: {
      const { testcases } = action.payload;
      return [...new Set([...testcases.map((item) => item.id), ...state])];
    }
    case submissionConstants.BROWSE_TESTCASES_SUCCESS: {
      const { testcases } = action.payload;
      return [...new Set([...testcases.map((item) => item.id), ...state])];
    }
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
