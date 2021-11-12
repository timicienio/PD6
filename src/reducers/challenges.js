import { combineReducers } from 'redux';
import { challengeConstants } from '../actions/myClass/constant';
import { commonConstants } from '../actions/common/constant';
import { viewConstants, peerReviewConstants } from '../actions/api/constant';

const emptyStatistics = {
  summary: [],
  memberSubmission: [],
};

const prototype = {
  id: null,
  class_id: null,
  publicize_type: null,
  selection_type: null,
  title: null,
  setter_id: null,
  description: null,
  start_time: null,
  end_time: null,
  is_deleted: null,
  problemIds: [],
  peerReviewIds: [],
  specialJudgeIds: [],
  essayIds: [],
  statistics: emptyStatistics,
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case challengeConstants.FETCH_CHALLENGES_SUCCESS: {
      const { data } = action.payload;
      return data.reduce(
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
    case challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_SUCCESS: {
      const { data, id } = action.payload;
      return {
        ...state,
        [id]: {
          ...prototype,
          ...state[id],
          problemIds: data.problem.map((item) => item.id),
          peerReviewIds: data.peer_review.map((item) => item.id),
          essayIds: data.essay.map((item) => item.id),
        },
      };
    }
    case commonConstants.READ_CHALLENGE_SUCCESS: {
      const data = action.payload;
      return {
        ...state,
        [data.id]: {
          ...prototype,
          ...state[data.id],
          ...data,
        },
      };
    }
    case challengeConstants.FETCH_CHALLENGE_SUMMARY_SUCCESS: {
      const { challengeId, data } = action.payload;
      return {
        ...state,
        [challengeId]: {
          ...state[challengeId],
          statistics: {
            ...prototype,
            ...state[challengeId].statistics,
            summary: data,
          },
        },
      };
    }
    case challengeConstants.FETCH_CHALLENGE_MEMBER_SUBMISSION_SUCCESS: {
      const { challengeId, data } = action.payload;

      return {
        ...state,
        [challengeId]: {
          ...state[challengeId],
          statistics: {
            ...prototype,
            ...state[challengeId].statistics,
            memberSubmission: data,
          },
        },
      };
    }

    case commonConstants.FETCH_ALL_CHALLENGES_PROBLEMS_SUCCESS: {
      const { challenges } = action.payload;
      return challenges.reduce(
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
    case viewConstants.BROWSE_MY_SUBMISSION_SUCCESS: {
      const { challenges } = action.payload.data;
      return challenges.reduce(
        (acc, item) => ({ ...acc, [item.id]: { ...prototype, ...state[item.id], ...item } }),
        state,
      );
    }

    case peerReviewConstants.READ_PEER_REVIEW_WITH_PROBLEM_SUCCESS: {
      const { challenge } = action.payload;
      return {
        ...state,
        [challenge.id]: { ...prototype, ...state[challenge.id], ...challenge },
      };
    }

    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case challengeConstants.FETCH_CHALLENGES_SUCCESS: {
      const { data } = action.payload;
      return [...new Set([...data.map((item) => item.id), ...state])];
    }
    case commonConstants.READ_CHALLENGE_SUCCESS: {
      return state.includes(action.payload.id) ? state : state.concat([action.payload.id]);
    }
    case commonConstants.FETCH_ALL_CHALLENGES_PROBLEMS_SUCCESS: {
      const { challenges } = action.payload;
      return [...new Set([...challenges.map((item) => item.id), ...state])];
    }
    case viewConstants.BROWSE_MY_SUBMISSION_SUCCESS: {
      const { challenges } = action.payload.data;
      return [...new Set([...challenges.map((item) => item.id), ...state])];
    }
    case peerReviewConstants.READ_PEER_REVIEW_WITH_PROBLEM_SUCCESS: {
      const { challenge } = action.payload;
      return [...new Set([challenge.id, ...state])];
    }
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
