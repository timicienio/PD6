import { challengeConstants } from '../../../actions/myClass/constant';

const initialState = {
  browseTasksUnderChallenge: false,
  fetchChallenges: false,
  addChallenge: false,
  editChallenge: false,
  deleteChallenge: false,
  fetchChallengeSummary: false,
  fetchChallengeMemberSubmission: false,
  addProblem: false,
  addEssay: false,
  addPeerReview: false,
};

export default function challenge(state = initialState, action) {
  switch (action.type) {
    case challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_START:
      return {
        ...state,
        browseTasksUnderChallenge: true,
      };
    case challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_SUCCESS:
      return {
        ...state,
        browseTasksUnderChallenge: false,
      };
    case challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_FAIL:
      return {
        ...state,
        browseTasksUnderChallenge: false,
      };

    case challengeConstants.FETCH_CHALLENGES_START: {
      return {
        ...state,
        fetchChallenges: true,
      };
    }
    case challengeConstants.FETCH_CHALLENGES_SUCCESS: {
      return {
        ...state,
        fetchChallenges: false,
      };
    }
    case challengeConstants.FETCH_CHALLENGES_FAIL: {
      return {
        ...state,
        fetchChallenges: false,
      };
    }

    case challengeConstants.ADD_CHALLENGE_START: {
      return {
        ...state,
        addChallenge: true,
      };
    }
    case challengeConstants.ADD_CHALLENGE_SUCCESS: {
      return {
        ...state,
        addChallenge: false,
      };
    }
    case challengeConstants.ADD_CHALLENGE_FAIL: {
      return {
        ...state,
        addChallenge: false,
      };
    }

    case challengeConstants.EDIT_CHALLENGE_START: {
      return {
        ...state,
        editChallenge: true,
      };
    }
    case challengeConstants.EDIT_CHALLENGE_SUCCESS: {
      return {
        ...state,
        editChallenge: false,
      };
    }
    case challengeConstants.EDIT_CHALLENGE_FAIL: {
      return {
        ...state,
        editChallenge: false,
      };
    }

    case challengeConstants.DELETE_CHALLENGE_START: {
      return {
        ...state,
        deleteChallenge: true,
      };
    }
    case challengeConstants.DELETE_CHALLENGE_SUCCESS: {
      return {
        ...state,
        deleteChallenge: false,
      };
    }
    case challengeConstants.DELETE_CHALLENGE_FAIL: {
      return {
        ...state,
        deleteChallenge: false,
      };
    }

    case challengeConstants.FETCH_CHALLENGE_SUMMARY_START: {
      return {
        ...state,
        fetchChallengeSummary: true,
      };
    }
    case challengeConstants.FETCH_CHALLENGE_SUMMARY_SUCCESS: {
      return {
        ...state,
        fetchChallengeSummary: false,
      };
    }
    case challengeConstants.FETCH_CHALLENGE_SUMMARY_FAIL: {
      return {
        ...state,
        fetchChallengeSummary: false,
      };
    }

    case challengeConstants.FETCH_CHALLENGE_MEMBER_SUBMISSION_START: {
      return {
        ...state,
        fetchChallengeMemberSubmission: true,
      };
    }
    case challengeConstants.FETCH_CHALLENGE_MEMBER_SUBMISSION_SUCCESS: {
      return {
        ...state,
        fetchChallengeMemberSubmission: false,
      };
    }
    case challengeConstants.FETCH_CHALLENGE_MEMBER_SUBMISSION_FAIL: {
      return {
        ...state,
        fetchChallengeMemberSubmission: false,
      };
    }

    case challengeConstants.ADD_PROBLEM_START: {
      return {
        ...state,
        addProblem: true,
      };
    }
    case challengeConstants.ADD_PROBLEM_SUCCESS: {
      return {
        ...state,
        addProblem: false,
      };
    }
    case challengeConstants.ADD_PROBLEM_FAIL: {
      return {
        ...state,
        addProblem: false,
      };
    }

    case challengeConstants.ADD_ESSAY_START: {
      return {
        ...state,
        addEssay: true,
      };
    }
    case challengeConstants.ADD_ESSAY_SUCCESS: {
      return {
        ...state,
        addEssay: false,
      };
    }
    case challengeConstants.ADD_ESSAY_FAIL: {
      return {
        ...state,
        addEssay: false,
      };
    }

    case challengeConstants.ADD_PEER_REVIEW_START: {
      return {
        ...state,
        addPeerReview: true,
      };
    }
    case challengeConstants.ADD_PEER_REVIEW_SUCCESS: {
      return {
        ...state,
        addPeerReview: false,
      };
    }
    case challengeConstants.ADD_PEER_REVIEW_FAIL: {
      return {
        ...state,
        addPeerReview: false,
      };
    }

    default: {
      return state;
    }
  }
}
