import { combineReducers } from 'redux';
import { challengeConstants } from '../actions/myClass/constant';
import { peerReviewConstants } from '../actions/api/constant';

const prototype = {
  id: null,
  challenge_id: null,
  challenge_label: null,
  title: null,
  target_problem_id: null,
  target_challenge_id: null,
  setter_id: null,
  description: null,
  min_score: null,
  max_score: null,
  max_review_count: null,
  start_time: null,
  end_time: null,
  is_deleted: null,
  receiveRecordIds: [],
  reviewRecordIds: [],
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_SUCCESS: {
      const { data } = action.payload;
      return data.peer_review.reduce((acc, item) => ({ ...acc, [item.id]: { ...prototype, ...state[item.id], ...item } }), state);
    }
    case peerReviewConstants.READ_PEER_REVIEW_SUCCESS: {
      return {
        ...state,
        [action.payload.id]: { ...prototype, ...state[action.payload.id], ...action.payload },
      };
    }
    // case peerReviewConstants.READ_PEER_REVIEW_RECORD_SUCCESS: {
    //   return {
    //     ...state,
    //     [action.payload.peer_review_id]: {
    //       ...prototype,
    //       ...state[action.payload.peer_review_id],
    //       recordIds: state[action.payload.peer_review_id] ? state[action.payload.peer_review_id].recordIds.concat([action.payload.id]) : [action.payload.id],
    //     },
    //   };
    // }
    case peerReviewConstants.BROWSE_ACCOUNT_ALL_PEER_REVIEW_RECORD_SUCCESS: {
      const { peerReviewId, reviewIds, receiveIds } = action.payload;
      return {
        ...state,
        [peerReviewId]: {
          ...prototype, ...state[peerReviewId], reviewRecordIds: reviewIds, receiveRecordIds: receiveIds,
        },
      };
    }

    case peerReviewConstants.BROWSE_ACCOUNT_REVIEWED_PEER_REVIEW_RECORD_SUCCESS: {
      const { peerReviewId, reviewIds } = action.payload;
      return {
        ...state,
        [peerReviewId]: { ...prototype, ...state[peerReviewId], reviewRecordIds: reviewIds },
      };
    }

    case peerReviewConstants.BROWSE_ACCOUNT_RECEIVED_PEER_REVIEW_RECORD_SUCCESS: {
      const { peerReviewId, receiveIds } = action.payload;
      return {
        ...state,
        [peerReviewId]: { ...prototype, ...state[peerReviewId], receiveRecordIds: receiveIds },
      };
    }

    case peerReviewConstants.GET_TARGET_PROBLEM_CHALLENGE_ID_SUCCESS: {
      const { peerReviewId, target_challenge_id } = action.payload;
      return {
        ...state,
        [peerReviewId]: { ...prototype, ...state[peerReviewId], target_challenge_id },
      };
    }

    case peerReviewConstants.READ_PEER_REVIEW_WITH_PROBLEM_SUCCESS: {
      const { peerReview } = action.payload;
      return {
        ...state,
        [peerReview.id]: { ...prototype, ...state[peerReview.id], ...peerReview },
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
      return [...new Set([...data.peer_review.map((item) => item.id), ...state])];
    }
    case peerReviewConstants.READ_PEER_REVIEW_SUCCESS: {
      return [...new Set([action.payload.id, ...state])];
    }
    case peerReviewConstants.READ_PEER_REVIEW_WITH_PROBLEM_SUCCESS: {
      const { peerReview } = action.payload;
      return [...new Set([peerReview.id, ...state])];
    }
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
