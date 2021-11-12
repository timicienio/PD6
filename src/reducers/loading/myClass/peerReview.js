import { peerReviewConstants } from '../../../actions/api/constant';

const initialState = {
  readPeerReviewWithProblem: false,
  readPeerReviewRecord: false,
  browseAccountAllPeerReviewRecord: false,
};

export default function peerReview(state = initialState, action) {
  switch (action.type) {
    case peerReviewConstants.READ_PEER_REVIEW_WITH_PROBLEM_START: {
      return {
        ...state,
        readPeerReviewWithProblem: true,
      };
    }
    case peerReviewConstants.READ_PEER_REVIEW_WITH_PROBLEM_SUCCESS:
    case peerReviewConstants.READ_PEER_REVIEW_WITH_PROBLEM_FAIL: {
      return {
        ...state,
        readPeerReviewWithProblem: false,
      };
    }

    case peerReviewConstants.READ_PEER_REVIEW_RECORD_START: {
      return {
        ...state,
        readPeerReviewRecord: true,
      };
    }
    case peerReviewConstants.READ_PEER_REVIEW_RECORD_SUCCESS:
    case peerReviewConstants.READ_PEER_REVIEW_RECORD_FAIL: {
      return {
        ...state,
        readPeerReviewRecord: false,
      };
    }

    case peerReviewConstants.BROWSE_ACCOUNT_ALL_PEER_REVIEW_RECORD_START: {
      return {
        ...state,
        browseAccountAllPeerReviewRecord: true,
      };
    }
    case peerReviewConstants.BROWSE_ACCOUNT_ALL_PEER_REVIEW_RECORD_SUCCESS:
    case peerReviewConstants.BROWSE_ACCOUNT_ALL_PEER_REVIEW_RECORD_FAIL: {
      return {
        ...state,
        browseAccountAllPeerReviewRecord: false,
      };
    }

    default: {
      return state;
    }
  }
}
