import { combineReducers } from 'redux';
import { submissionConstants, problemConstants } from '../actions/myClass/constant';
import { viewConstants } from '../actions/api/constant';

const verdictMapping = new Map([
  ['ACCEPTED', 'Accepted'],
  ['WRONG ANSWER', 'Wrong Answer'],
  ['MEMORY LIMIT EXCEED', 'Memory Limit Exceed'],
  ['TIME LIMIT EXCEED', 'Time Limit Exceed'],
  ['RUNTIME ERROR', 'Runtime Error'],
  ['COMPILE ERROR', 'Compile Error'],
  ['CONTACT MANAGER', 'Contact Manager'],
  ['FORBIDDEN ACTION', 'Forbidden Action'],
  ['SYSTEM ERROR', 'System Error'],
  [null, null],
]);

const prototype = {
  id: null,
  account_id: null,
  problem_id: null,
  language_id: null,
  content_file_uuid: null,
  content_length: null,
  filename: null,
  submit_time: null,
  latestJudgmentId: null,
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case viewConstants.BROWSE_SUBMISSION_UNDER_CLASS_SUCCESS: {
      const { data } = action.payload;
      return data.submissions.reduce(
        (acc, item) => ({ ...acc, [item.id]: { ...item, verdict: verdictMapping.get(item.verdict) } }),
        state,
      );
    }
    case viewConstants.BROWSE_MY_SUBMISSION_SUCCESS: {
      const { data } = action.payload;
      return data.submissions.reduce(
        (acc, item) => ({ ...acc, [item.id]: { ...item, verdict: verdictMapping.get(item.verdict) } }),
        state,
      );
    }
    case submissionConstants.FETCH_SUBMISSION_SUCCESS: {
      const { submissionId, data } = action.payload;
      return {
        ...state,
        [Number(submissionId)]: { ...state[Number(submissionId)], ...data },
      };
    }
    case problemConstants.READ_SUBMISSION_SUCCESS: {
      return action.payload.reduce((acc, item) => ({ ...acc, [item.id]: { ...item, latestJudgmentId: null } }), state);
    }

    case submissionConstants.FETCH_SUBMISSIONS_SUCCESS: {
      const { data } = action.payload;
      return data.reduce((acc, item) => ({ ...acc, [item.id]: { ...item, latestJudgmentId: null } }), state);
    }

    case submissionConstants.READ_SUBMISSION_JUDGE_SUCCESS: {
      const { submissionId, judgment } = action.payload;
      return {
        ...state,
        [submissionId]: { ...state[submissionId], latestJudgmentId: judgment.id },
      };
    }
    case problemConstants.VIEW_MY_SUBMISSION_UNDER_PROBLEM_SUCCESS: {
      const { submissions } = action.payload;
      return submissions.reduce(
        (acc, item) => ({ ...acc, [item.id]: { ...prototype, ...item, verdict: verdictMapping.get(item.verdict) } }),
        state,
      );
    }
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case viewConstants.BROWSE_SUBMISSION_UNDER_CLASS_SUCCESS: {
      const { data } = action.payload;
      return [...new Set([...data.submissions.map((item) => item.id), ...state])];
    }
    case viewConstants.BROWSE_MY_SUBMISSION_SUCCESS: {
      const { data } = action.payload;
      return [...new Set([...data.submissions.map((item) => item.id), ...state])];
    }
    case problemConstants.READ_SUBMISSION_SUCCESS: {
      return action.payload.map((item) => item.id);
    }
    case submissionConstants.FETCH_SUBMISSION_SUCCESS: {
      const { submissionId } = action.payload;
      return [...new Set([submissionId, ...state])];
    }
    case submissionConstants.FETCH_SUBMISSIONS_SUCCESS: {
      const { data } = action.payload;
      return [...new Set([...data.map((item) => item.id), ...state])];
    }
    case problemConstants.VIEW_MY_SUBMISSION_UNDER_PROBLEM_SUCCESS: {
      const { submissions } = action.payload;
      return [...new Set([...submissions.map((item) => item.id), ...state])];
    }
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
