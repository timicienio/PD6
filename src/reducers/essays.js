import { combineReducers } from 'redux';
import { challengeConstants, essayConstants } from '../actions/myClass/constant';

const byId = (state = {}, action) => {
  switch (action.type) {
    case challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_SUCCESS: {
      const { data } = action.payload;
      return data.essay.reduce((acc, item) => ({ ...acc, [item.id]: { ...item, essaySubmissionId: null } }), state);
    }
    case essayConstants.READ_ESSAY_SUCCESS: {
      const { essay, submission } = action.payload;
      return {
        ...state,
        [essay.id]: {
          ...essay,
          essaySubmissionId: submission.length === 0 ? null : submission[0].id,
        },
      };
    }
    case essayConstants.READ_ESSAY_SUBMISSION_SUCCESS: {
      const data = action.payload;
      return {
        ...state,
        [data.essay_id]: {
          ...state[data.essay_id],
          essaySubmissionId: data.id,
        },
      };
    }
    case essayConstants.UPLOAD_ESSAY_SUBMISSION_SUCCESS: {
      const data = action.payload;
      return {
        ...state,
        [data.essay_id]: {
          ...state[data.essay_id],
          essaySubmissionId: data.id,
        },
      };
    }

    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_SUCCESS: {
      const { data } = action.payload;
      return [...new Set([...data.essay.map((item) => item.id), ...state])];
    }
    case essayConstants.READ_ESSAY_SUCCESS:
      return state.includes(action.payload.essay.id) ? state : state.concat([action.payload.essay.id]);
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
