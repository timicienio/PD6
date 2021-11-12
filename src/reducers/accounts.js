import { combineReducers } from 'redux';
import { accountConstants } from '../actions/admin/constant';
import { gradeConstants, challengeConstants } from '../actions/myClass/constant';
import { userConstants } from '../actions/user/constants';
import { commonConstants } from '../actions/common/constant';
import { viewConstants } from '../actions/api/constant';

const prototype = {
  id: null,
  username: null,
  real_name: null,
  role: null,
  student_id: null,
  referral: null,
  studentCardIds: [],
  pendingStudentCardIds: [],
  gradeIds: [],
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case userConstants.READ_OTHERS_ACCOUNT_SUCCESS: {
      return {
        ...state,
        [action.payload.id]: {
          ...prototype,
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    }

    // case accountConstants.FETCH_ACCOUNTS_SUCCESS: {
    //   return action.payload.reduce(
    //     (acc, item) => ({
    //       ...acc,
    //       [item.id]: {
    //         ...prototype,
    //         ...state[action.payload.id],
    //         ...item,
    //       },
    //     }),
    //     state,
    //   );
    // }

    case viewConstants.BROWSE_ACCESS_LOG_SUCCESS:
    case viewConstants.BROWSE_ACCOUNT_WITH_DEFAULT_STUDENT_ID_SUCCESS:
    case viewConstants.BROWSE_CLASS_MEMBER_SUCCESS:
    case viewConstants.BROWSE_SUBMISSION_UNDER_CLASS_SUCCESS: {
      const { accounts } = action.payload.data;
      return accounts.reduce(
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

    case challengeConstants.FETCH_CHALLENGE_MEMBER_SUBMISSION_SUCCESS: {
      const { accounts } = action.payload;
      return accounts.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: {
            ...prototype,
            ...state[action.payload.id],
            ...item,
          },
        }),
        state,
      );
    }

    case commonConstants.FETCH_ACCOUNT_SUCCESS: {
      return {
        ...state,
        [action.payload.id]: {
          ...prototype,
          ...state[action.payload.id],
          ...action.payload,
        },
      };
    }

    case commonConstants.FETCH_CLASS_MEMBER_WITH_ACCOUNT_REFERRAL_SUCCESS: {
      const { accounts } = action.payload.data;
      return accounts.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: {
            ...prototype,
            ...state[action.payload.id],
            ...item,
          },
        }),
        state,
      );
    }

    case accountConstants.FETCH_STUDENT_CARDS_SUCCESS: {
      const { id, data } = action.payload;
      return {
        ...state,
        [id]: {
          ...prototype,
          ...state[id],
          studentCardIds: data.map((dataItem) => dataItem.id),
        },
      };
    }

    case accountConstants.FETCH_STUDENT_CARDS_FAIL: {
      const { id } = action.payload;
      return {
        ...state,
        [id]: {
          ...prototype,
          ...state[id],
          studentCardIds: [],
        },
      };
    }

    case accountConstants.BROWSE_PENDING_STUDENT_CARDS_SUCCESS: {
      const { accountId, data } = action.payload;
      return {
        ...state,
        [accountId]: {
          ...prototype,
          ...state[accountId],
          pendingStudentCardIds: data.map((dataItem) => dataItem.id),
        },
      };
    }

    case gradeConstants.FETCH_ACCOUNT_GRADE_SUCCESS: {
      const { accountId, data } = action.payload;
      return {
        ...state,
        [accountId]: {
          ...prototype,
          ...state[accountId],
          gradeIds: data === null ? [] : data.map((item) => item.id),
        },
      };
    }

    case commonConstants.GET_ACCOUNT_BATCH_SUCCESS: {
      const { accountId, data } = action.payload;
      return {
        ...state,
        [accountId]: {
          ...prototype,
          ...state[accountId],
          id: data.id,
          real_name: data.real_name,
          student_id: data.student_id,
          username: data.username,
        },
      };
    }

    case gradeConstants.FETCH_GRADE_SUCCESS:
    case viewConstants.BROWSE_CLASS_GRADE_SUCCESS: {
      const { accounts } = action.payload;
      return accounts.reduce(
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

    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case viewConstants.BROWSE_ACCESS_LOG_SUCCESS:
    case viewConstants.BROWSE_ACCOUNT_WITH_DEFAULT_STUDENT_ID_SUCCESS:
    case viewConstants.BROWSE_CLASS_MEMBER_SUCCESS:
    case viewConstants.BROWSE_SUBMISSION_UNDER_CLASS_SUCCESS: {
      const { accounts } = action.payload.data;
      return [...new Set([...accounts.map((item) => item.id), ...state])];
    }

    // case accountConstants.FETCH_ACCOUNTS_SUCCESS: {
    //   return [...new Set([...action.payload.map((item) => item.id), ...state])];
    // }

    case commonConstants.FETCH_ACCOUNT_SUCCESS: {
      const { id } = action.payload;
      return [...new Set([id, ...state])];
    }

    // case submissionConstants.FETCH_SUBMISSIONS_SUCCESS: {
    //   const { accounts } = action.payload;
    //   return [...new Set([...accounts.map((item) => item.id), ...state])];
    // }

    case commonConstants.GET_ACCOUNT_BATCH_SUCCESS: {
      const { accountId } = action.payload;
      return [...new Set([accountId, ...state])];
    }

    case userConstants.READ_OTHERS_ACCOUNT_SUCCESS: {
      return [...new Set([action.payload.id, ...state])];
    }

    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
