import { viewConstants } from '../../../actions/api/constant';

const initialState = {
  browseAccessLog: false,
  browseAccountWithDefaultStudentId: false,
  browseClassMember: false,
  browseSubmissionUnderClass: false,
  browseMySubmission: false,
  browsePeerReviewSummaryReview: false,
  browsePeerReviewSummaryReceive: false,
};

export default function view(state = initialState, action) {
  switch (action.type) {
    case viewConstants.BROWSE_ACCESS_LOG_START: {
      return {
        ...state,
        browseAccessLog: true,
      };
    }
    case viewConstants.BROWSE_ACCESS_LOG_SUCCESS:
    case viewConstants.BROWSE_ACCESS_LOG_FAIL: {
      return {
        ...state,
        browseAccessLog: false,
      };
    }

    case viewConstants.BROWSE_ACCOUNT_WITH_DEFAULT_STUDENT_ID_START: {
      return {
        ...state,
        browseAccountWithDefaultStudentId: true,
      };
    }
    case viewConstants.BROWSE_ACCOUNT_WITH_DEFAULT_STUDENT_ID_SUCCESS:
    case viewConstants.BROWSE_ACCOUNT_WITH_DEFAULT_STUDENT_ID_FAIL: {
      return {
        ...state,
        browseAccountWithDefaultStudentId: false,
      };
    }

    case viewConstants.BROWSE_CLASS_MEMBER_START: {
      return {
        ...state,
        browseClassMember: true,
      };
    }
    case viewConstants.BROWSE_CLASS_MEMBER_SUCCESS:
    case viewConstants.BROWSE_CLASS_MEMBER_FAIL: {
      return {
        ...state,
        browseClassMember: false,
      };
    }

    case viewConstants.BROWSE_SUBMISSION_UNDER_CLASS_START: {
      return {
        ...state,
        browseSubmissionUnderClass: true,
      };
    }
    case viewConstants.BROWSE_SUBMISSION_UNDER_CLASS_SUCCESS:
    case viewConstants.BROWSE_SUBMISSION_UNDER_CLASS_FAIL: {
      return {
        ...state,
        browseSubmissionUnderClass: false,
      };
    }

    case viewConstants.BROWSE_MY_SUBMISSION_START: {
      return {
        ...state,
        browseMySubmission: true,
      };
    }
    case viewConstants.BROWSE_MY_SUBMISSION_SUCCESS:
    case viewConstants.BROWSE_MY_SUBMISSION_FAIL: {
      return {
        ...state,
        browseMySubmission: false,
      };
    }

    case viewConstants.BROWSE_PEER_REVIEW_SUMMARY_REVIEW_START: {
      return {
        ...state,
        browsePeerReviewSummaryReview: true,
      };
    }
    case viewConstants.BROWSE_PEER_REVIEW_SUMMARY_REVIEW_SUCCESS:
    case viewConstants.BROWSE_PEER_REVIEW_SUMMARY_REVIEW_FAIL: {
      return {
        ...state,
        browsePeerReviewSummaryReview: false,
      };
    }

    case viewConstants.BROWSE_PEER_REVIEW_SUMMARY_RECEIVE_START: {
      return {
        ...state,
        browsePeerReviewSummaryReceive: true,
      };
    }
    case viewConstants.BROWSE_PEER_REVIEW_SUMMARY_RECEIVE_SUCCESS:
    case viewConstants.BROWSE_PEER_REVIEW_SUMMARY_RECEIVE_FAIL: {
      return {
        ...state,
        browsePeerReviewSummaryReceive: false,
      };
    }

    default: {
      return state;
    }
  }
}
