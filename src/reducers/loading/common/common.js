import { commonConstants } from '../../../actions/common/constant';

const initialState = {
  fetchInstitutes: false,
  fetchClassMembers: false,
  fetchClassMemberWithAccountReferral: false,
  replaceClassMembers: false,
  browseSubmitLang: false,
  fetchCourse: false,
  fetchClass: false,
  fetchAccount: false,
  fetchChallenge: false,
  fetchAllChallengesProblems: false,
  fetchDownloadFileUrl: false,
  fetchProblems: false,
  getAccountBatch: false,
  getAccountBatchByReferral: false,
};

export default function common(state = initialState, action) {
  switch (action.type) {
    case commonConstants.GET_INSTITUTE_START: {
      return {
        ...state,
        fetchInstitutes: true,
      };
    }
    case commonConstants.GET_INSTITUTE_SUCCESS: {
      return {
        ...state,
        fetchInstitutes: false,
      };
    }
    case commonConstants.GET_INSTITUTE_FAIL: {
      return {
        ...state,
        fetchInstitutes: false,
      };
    }
    case commonConstants.FETCH_CLASS_MEMBERS_START: {
      return {
        ...state,
        fetchClassMembers: true,
      };
    }
    case commonConstants.FETCH_CLASS_MEMBERS_SUCCESS: {
      return {
        ...state,
        fetchClassMembers: false,
      };
    }
    case commonConstants.FETCH_CLASS_MEMBERS_FAIL: {
      return {
        ...state,
        fetchClassMembers: false,
      };
    }
    case commonConstants.FETCH_CLASS_MEMBER_WITH_ACCOUNT_REFERRAL_START: {
      return {
        ...state,
        fetchClassMembers: true,
      };
    }
    case commonConstants.FETCH_CLASS_MEMBER_WITH_ACCOUNT_REFERRAL_SUCCESS: {
      return {
        ...state,
        fetchClassMembers: false,
      };
    }
    case commonConstants.FETCH_CLASS_MEMBER_WITH_ACCOUNT_REFERRAL_FAIL: {
      return {
        ...state,
        fetchClassMembers: false,
      };
    }

    case commonConstants.REPLACE_CLASS_MEMBERS_START: {
      return {
        ...state,
        replaceClassMembers: true,
      };
    }
    case commonConstants.REPLACE_CLASS_MEMBERS_SUCCESS: {
      return {
        ...state,
        replaceClassMembers: false,
      };
    }
    case commonConstants.REPLACE_CLASS_MEMBERS_FAIL: {
      return {
        ...state,
        replaceClassMembers: false,
      };
    }
    case commonConstants.FETCH_COURSE_START: {
      return {
        ...state,
        fetchCourse: true,
      };
    }
    case commonConstants.FETCH_COURSE_SUCCESS: {
      return {
        ...state,
        fetchCourse: false,
      };
    }
    case commonConstants.FETCH_COURSE_FAIL: {
      return {
        ...state,
        fetchCourse: false,
      };
    }
    case commonConstants.FETCH_CLASS_START: {
      return {
        ...state,
        fetchClass: true,
      };
    }
    case commonConstants.FETCH_CLASS_SUCCESS: {
      return {
        ...state,
        fetchClass: false,
      };
    }
    case commonConstants.FETCH_CLASS_FAIL: {
      return {
        ...state,
        fetchClass: false,
      };
    }
    case commonConstants.READ_CHALLENGE_START: {
      return {
        ...state,
        fetchChallenge: true,
      };
    }
    case commonConstants.READ_CHALLENGE_SUCCESS: {
      return {
        ...state,
        fetchChallenge: false,
      };
    }
    case commonConstants.READ_CHALLENGE_FAIL: {
      return {
        ...state,
        fetchChallenge: false,
      };
    }
    case commonConstants.FETCH_ACCOUNT_START: {
      return {
        ...state,
        fetchAccount: true,
      };
    }
    case commonConstants.FETCH_ACCOUNT_SUCCESS: {
      return {
        ...state,
        fetchAccount: false,
      };
    }
    case commonConstants.FETCH_ACCOUNT_FAIL: {
      return {
        ...state,
        fetchAccount: false,
      };
    }

    case commonConstants.BROWSE_SUBMISSION_LANG_START: {
      return {
        ...state,
        browseSubmitLang: true,
      };
    }
    case commonConstants.BROWSE_SUBMISSION_LANG_SUCCESS: {
      return {
        ...state,
        browseSubmitLang: false,
      };
    }
    case commonConstants.BROWSE_SUBMISSION_LANG_FAIL: {
      return {
        ...state,
        browseSubmitLang: false,
      };
    }

    case commonConstants.FETCH_ALL_CHALLENGES_PROBLEMS_START: {
      return {
        ...state,
        fetchAllChallengesProblems: true,
      };
    }
    case commonConstants.FETCH_ALL_CHALLENGES_PROBLEMS_SUCCESS: {
      return {
        ...state,
        fetchAllChallengesProblems: false,
      };
    }
    case commonConstants.FETCH_ALL_CHALLENGES_PROBLEMS_FAIL: {
      return {
        ...state,
        fetchAllChallengesProblems: false,
      };
    }

    case commonConstants.FETCH_DOWNLOAD_FILE_URL_START: {
      return {
        ...state,
        fetchDownloadFileUrl: true,
      };
    }
    case commonConstants.FETCH_DOWNLOAD_FILE_URL_SUCCESS: {
      return {
        ...state,
        fetchDownloadFileUrl: false,
      };
    }
    case commonConstants.FETCH_DOWNLOAD_FILE_URL_FAIL: {
      return {
        ...state,
        fetchDownloadFileUrl: false,
      };
    }

    case commonConstants.FETCH_PROBLEMS_START:
      return {
        ...state,
        fetchProblems: true,
      };
    case commonConstants.FETCH_PROBLEMS_SUCCESS:
      return {
        ...state,
        fetchProblems: false,
      };
    case commonConstants.FETCH_PROBLEMS_FAIL:
      return {
        ...state,
        fetchProblems: false,
      };

    case commonConstants.GET_ACCOUNT_BATCH_START: {
      return {
        ...state,
        getAccountBatch: true,
      };
    }
    case commonConstants.GET_ACCOUNT_BATCH_SUCCESS: {
      return {
        ...state,
        getAccountBatch: false,
      };
    }
    case commonConstants.GET_ACCOUNT_BATCH_FAIL: {
      return {
        ...state,
        getAccountBatch: false,
      };
    }

    case commonConstants.GET_ACCOUNT_BATCH_BY_REFERRAL_START: {
      return {
        ...state,
        getAccountBatchByReferral: true,
      };
    }
    case commonConstants.GET_ACCOUNT_BATCH_BY_REFERRAL_SUCCESS: {
      return {
        ...state,
        getAccountBatchByReferral: false,
      };
    }
    case commonConstants.GET_ACCOUNT_BATCH_BY_REFERRAL_FAIL: {
      return {
        ...state,
        getAccountBatchByReferral: false,
      };
    }

    default: {
      return state;
    }
  }
}
