import { combineReducers } from 'redux';
import { viewConstants } from '../actions/api/constant';

const prototype = {
  account_id: null,
  username: null,
  real_name: null,
  student_id: null,
  peer_review_record_ids: [],
  score: [],
  average_score: null,
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case viewConstants.BROWSE_ALL_PEER_REVIEW_RECEIVE_SUCCESS:
    case viewConstants.BROWSE_PEER_REVIEW_SUMMARY_RECEIVE_SUCCESS: {
      const { peerReviewSummary } = action.payload.data;

      return peerReviewSummary.reduce(
        (acc, item) => ({
          ...acc,
          [item.account_id]: {
            ...prototype,
            ...state[item.account_id],
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
    case viewConstants.BROWSE_ALL_PEER_REVIEW_RECEIVE_SUCCESS:
    case viewConstants.BROWSE_PEER_REVIEW_SUMMARY_RECEIVE_SUCCESS: {
      const { peerReviewSummary } = action.payload.data;
      return [...new Set([...peerReviewSummary.map((item) => item.account_id), ...state])];
    }
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
