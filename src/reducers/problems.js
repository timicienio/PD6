import { combineReducers } from 'redux';
import { problemConstants, challengeConstants, submissionConstants } from '../actions/myClass/constant';
import { commonConstants } from '../actions/common/constant';
import { viewConstants, peerReviewConstants } from '../actions/api/constant';

const prototype = {
  id: null,
  challenge_id: null,
  challenge_label: null,
  title: null,
  judge_type: null, // NORMAL or CUSTOMIZED
  setter_id: null,
  full_score: null,
  description: null,
  io_description: null,
  source: null,
  hint: null,
  is_deleted: null,
  testcaseIds: [],
  assistingDataIds: [],
  score: '',
  judge_source: {
    judge_language: null,
    judge_code: null, // code content
    code_uuid: null,
    filename: null,
  },
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_SUCCESS: {
      const { data } = action.payload;
      return data.problem.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: {
            ...prototype,
            ...item,
            testcaseIds: state[item.id] ? state[item.id].testcaseIds : [],
            assistingDataIds: [],
            score: state[item.id] ? state[item.id].score : '',
          },
        }),
        state,
      );
    }
    case problemConstants.READ_PROBLEM_SUCCESS: {
      const data = action.payload;
      return {
        ...state,
        [data.id]: {
          ...prototype,
          ...data,
          testcaseIds: state[data.id] ? state[data.id].testcaseIds : [],
          assistingDataIds: [],
          score: state[data.id] ? state[data.id].score : '',
        },
      };
    }
    case problemConstants.FETCH_TESTCASE_UNDER_PROBLEM_SUCCESS: {
      const { problemId, testcases } = action.payload;
      const testcaseIds = testcases.map((item) => item.id);
      return {
        ...state,
        [problemId]: {
          ...state[problemId],
          testcaseIds,
        },
      };
    }
    case problemConstants.BROWSE_ASSISTING_DATA_SUCCESS: {
      const { problemId, assistingData } = action.payload;
      const assistingDataIds = assistingData.map((item) => item.id);
      return {
        ...state,
        [problemId]: {
          ...state[problemId],
          assistingDataIds,
        },
      };
    }
    case problemConstants.EDIT_PROBLEM_SUCCESS: {
      const { problemId, content } = action.payload;
      return {
        ...state,
        [problemId]: {
          ...state[problemId],
          title: content.title,
          full_score: content.full_score,
          description: content.description,
          io_description: content.io_description,
          source: content.source,
          hint: content.hint,
        },
      };
    }

    case commonConstants.FETCH_ALL_CHALLENGES_PROBLEMS_SUCCESS: {
      const { problems } = action.payload;
      return problems.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: {
            ...prototype,
            ...item,
            testcaseIds: [],
            assistingDataIds: [],
          },
        }),
        state,
      );
    }

    case problemConstants.READ_PROBLEM_SCORE_SUCCESS: {
      const { data, problemId } = action.payload;
      return {
        ...state,
        [problemId]: {
          ...state[problemId],
          score: data.score,
        },
      };
    }

    case problemConstants.READ_PROBLEM_BEST_SCORE_SUCCESS: {
      const { data, problemId } = action.payload;

      return {
        ...state,
        [problemId]: {
          ...state[problemId],
          score: data.score,
        },
      };
    }

    case commonConstants.FETCH_PROBLEMS_SUCCESS: {
      const data = action.payload;
      return data.reduce(
        (acc, problem) => ({
          ...acc,
          [problem.problem_id]: {
            ...prototype,
            ...problem,
            ...state[problem.problem_id],
          },
        }),
        state,
      );
    }

    case problemConstants.BROWSE_TESTCASES_SUCCESS: {
      const { problemId, testcases } = action.payload;
      const testcaseIds = testcases.map((item) => item.id);
      return {
        ...state,
        [problemId]: {
          ...state[problemId],
          testcaseIds,
        },
      };
    }

    case submissionConstants.BROWSE_TESTCASES_SUCCESS: {
      const { problemId, testcases } = action.payload;
      const testcaseIds = testcases.map((item) => item.id);
      return {
        ...state,
        [problemId]: {
          ...state[problemId],
          testcaseIds,
        },
      };
    }
    case viewConstants.BROWSE_MY_SUBMISSION_SUCCESS: {
      const { problems } = action.payload.data;
      return problems.reduce((acc, item) => ({ ...acc, [item.id]: { ...prototype, ...item } }), state);
    }

    case peerReviewConstants.READ_PEER_REVIEW_WITH_PROBLEM_SUCCESS: {
      const { problem } = action.payload;
      return {
        ...state,
        [problem.id]: { ...prototype, ...state[problem.id], ...problem },
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
      return [...new Set([...data.problem.map((item) => item.id), ...state])];
    }
    case problemConstants.READ_PROBLEM_SUCCESS:
      return state.includes(action.payload.id) ? state : state.concat([action.payload.id]);

    case commonConstants.FETCH_ALL_CHALLENGES_PROBLEMS_SUCCESS: {
      const { problems } = action.payload;
      return [...new Set([...problems.map((item) => item.id), ...state])];
    }

    case commonConstants.FETCH_PROBLEMS_SUCCESS: {
      const data = action.payload;
      return [...new Set([...data.map((item) => item.problem_id), ...state])];
    }
    case viewConstants.BROWSE_MY_SUBMISSION_SUCCESS: {
      const { problems } = action.payload.data;
      return [...new Set([...problems.map((item) => item.id), ...state])];
    }

    case peerReviewConstants.READ_PEER_REVIEW_WITH_PROBLEM_SUCCESS: {
      const { problem } = action.payload;
      return [...new Set([problem.id, ...state])];
    }

    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
