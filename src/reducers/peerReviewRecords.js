import { combineReducers } from 'redux';
import { peerReviewConstants } from '../actions/api/constant';

const prototype = {
  id: null,
  peer_review_id: null,
  grader_id: null,
  receiver_id: null,
  score: null,
  comment: null,
  submit_time: null,
  code: null,
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case peerReviewConstants.READ_PEER_REVIEW_RECORD_SUCCESS: {
      return {
        ...state,
        [action.payload.id]: { ...prototype, ...action.payload },
      };
    }

    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case peerReviewConstants.READ_PEER_REVIEW_RECORD_SUCCESS: {
      return [...new Set([action.payload.id, ...state])];
    }
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
