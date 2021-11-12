import { viewConstants } from '../../../actions/api/constant';

const initialState = {
  browseAccessLog: null,
  browseAccountWithDefaultStudentId: null,
  browseClassMember: null,
  browseSubmissionUnderClass: null,
  browseMySubmission: null,
  browsePeerReviewSummaryReview: null,
  browsePeerReviewSummaryReceive: null,
};

export default function view(state = initialState, action) {
  switch (action.type) {
    case viewConstants.BROWSE_ACCESS_LOG_START: {
      return {
        ...state,
        browseAccessLog: null,
      };
    }
    case viewConstants.BROWSE_ACCESS_LOG_FAIL: {
      return {
        ...state,
        browseAccessLog: action.error,
      };
    }

    case viewConstants.BROWSE_ACCOUNT_WITH_DEFAULT_STUDENT_ID_START: {
      return {
        ...state,
        browseAccountWithDefaultStudentId: null,
      };
    }
    case viewConstants.BROWSE_ACCOUNT_WITH_DEFAULT_STUDENT_ID_FAIL: {
      return {
        ...state,
        browseAccountWithDefaultStudentId: action.error,
      };
    }

    case viewConstants.BROWSE_CLASS_MEMBER_START: {
      return {
        ...state,
        browseClassMember: null,
      };
    }
    case viewConstants.BROWSE_CLASS_MEMBER_FAIL: {
      return {
        ...state,
        browseClassMember: action.error,
      };
    }

    case viewConstants.BROWSE_SUBMISSION_UNDER_CLASS_START: {
      return {
        ...state,
        browseSubmissionUnderClass: null,
      };
    }
    case viewConstants.BROWSE_SUBMISSION_UNDER_CLASS_FAIL: {
      return {
        ...state,
        browseSubmissionUnderClass: action.error,
      };
    }

    case viewConstants.BROWSE_MY_SUBMISSION_START: {
      return {
        ...state,
        browsemySubmission: null,
      };
    }
    case viewConstants.BROWSE_MY_SUBMISSION_FAIL: {
      return {
        ...state,
        browseMySubmission: action.error,
      };
    }

    case viewConstants.BROWSE_PEER_REVIEW_SUMMARY_REVIEW_START: {
      return {
        ...state,
        browsePeerReviewSummaryReview: null,
      };
    }
    case viewConstants.BROWSE_PEER_REVIEW_SUMMARY_REVIEW_FAIL: {
      return {
        ...state,
        browsePeerReviewSummaryReview: action.error,
      };
    }

    case viewConstants.BROWSE_PEER_REVIEW_SUMMARY_RECEIVE_START: {
      return {
        ...state,
        browsePeerReviewSummaryReceive: null,
      };
    }
    case viewConstants.BROWSE_PEER_REVIEW_SUMMARY_RECEIVE_FAIL: {
      return {
        ...state,
        browsePeerReviewSummaryReceive: action.error,
      };
    }

    default: {
      return state;
    }
  }
}
