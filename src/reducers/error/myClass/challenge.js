import { challengeConstants } from '../../../actions/myClass/constant';

const initialState = {
  browseTasksUnderChallenge: null,
  fetchChallenges: null,
  addChallenge: null,
  editChallenge: null,
  deleteChallenge: null,
  fetchChallengeSummary: null,
  fetchChallengeMemberSubmission: null,
  addProblem: null,
  addEssay: null,
  addPeerReview: null,
};

export default function challenge(state = initialState, action) {
  switch (action.type) {
    case challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_SUCCESS:
      return {
        ...state,
        browseTasksUnderChallenge: null,
      };
    case challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_FAIL:
      return {
        ...state,
        browseTasksUnderChallenge: action.error,
      };

    case challengeConstants.FETCH_CHALLENGES_SUCCESS: {
      return {
        ...state,
        fetchChallenges: null,
      };
    }
    case challengeConstants.FETCH_CHALLENGES_FAIL: {
      return {
        ...state,
        fetchChallenges: action.error,
      };
    }

    case challengeConstants.ADD_CHALLENGE_SUCCESS: {
      return {
        ...state,
        addChallenge: null,
      };
    }
    case challengeConstants.ADD_CHALLENGE_FAIL: {
      return {
        ...state,
        addChallenge: action.error,
      };
    }

    case challengeConstants.EDIT_CHALLENGE_SUCCESS: {
      return {
        ...state,
        editChallenge: null,
      };
    }
    case challengeConstants.EDIT_CHALLENGE_FAIL: {
      return {
        ...state,
        editChallenge: action.error,
      };
    }

    case challengeConstants.DELETE_CHALLENGE_SUCCESS: {
      return {
        ...state,
        deleteChallenge: null,
      };
    }
    case challengeConstants.DELETE_CHALLENGE_FAIL: {
      return {
        ...state,
        deleteChallenge: action.error,
      };
    }

    case challengeConstants.FETCH_CHALLENGE_SUMMARY_SUCCESS: {
      return {
        ...state,
        fetchChallengeSummary: null,
      };
    }
    case challengeConstants.FETCH_CHALLENGE_SUMMARY_FAIL: {
      return {
        ...state,
        fetchChallengeSummary: action.error,
      };
    }

    case challengeConstants.FETCH_CHALLENGE_MEMBER_SUBMISSION_SUCCESS: {
      return {
        ...state,
        fetchChallengeMemberSubmission: null,
      };
    }
    case challengeConstants.FETCH_CHALLENGE_MEMBER_SUBMISSION_FAIL: {
      return {
        ...state,
        fetchChallengeMemberSubmission: action.error,
      };
    }

    case challengeConstants.ADD_PROBLEM_SUCCESS: {
      return {
        ...state,
        addProblem: null,
      };
    }
    case challengeConstants.ADD_PROBLEM_FAIL: {
      return {
        ...state,
        addProblem: action.error,
      };
    }

    case challengeConstants.ADD_ESSAY_SUCCESS: {
      return {
        ...state,
        addEssay: null,
      };
    }
    case challengeConstants.ADD_ESSAY_FAIL: {
      return {
        ...state,
        addEssay: action.error,
      };
    }

    case challengeConstants.ADD_PEER_REVIEW_SUCCESS: {
      return {
        ...state,
        addPeerReview: null,
      };
    }
    case challengeConstants.ADD_PEER_REVIEW_FAIL: {
      return {
        ...state,
        addPeerReview: action.error,
      };
    }
    default: {
      return state;
    }
  }
}
