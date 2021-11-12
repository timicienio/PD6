import { userConstants } from '../../../actions/user/constants';

const initialState = {
  editAccount: false,
  fetchStudentCards: false,
  addStudentCard: false,
  makeStudentCardDefault: false,
  resetPassword: false,
  editPassword: false,
  browsePendingStudentCards: false,
  resendEmailVerification: false,
  deletePendingStudentCard: false,
  readOthersAccount: false,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case userConstants.READ_OTHERS_ACCOUNT_START:
      return {
        ...state,
        readOthersAccount: true,
      };
    case userConstants.READ_OTHERS_ACCOUNT_SUCCESS: {
      return {
        ...state,
        readOthersAccount: false,
      };
    }
    case userConstants.READ_OTHERS_ACCOUNT_FAIL:
      return {
        ...state,
        readOthersAccount: false,
      };

    case userConstants.EDIT_SELF_ACCOUNT_START:
      return {
        ...state,
        editAccount: true,
      };
    case userConstants.EDIT_SELF_ACCOUNT_SUCCESS:
      return {
        ...state,
        editAccount: false,
      };
    case userConstants.EDIT_SELF_ACCOUNT_FAIL:
      return {
        ...state,
        editAccount: false,
      };
    case userConstants.MAKE_SELF_STUDENT_CARD_DEFAULT_START:
      return {
        ...state,
        makeStudentCardDefault: true,
      };
    case userConstants.MAKE_SELF_STUDENT_CARD_DEFAULT_SUCCESS:
      return {
        ...state,
        makeStudentCardDefault: false,
      };
    case userConstants.MAKE_SELF_STUDENT_CARD_DEFAULT_FAIL:
      return {
        ...state,
        makeStudentCardDefault: false,
      };
    case userConstants.GET_SELF_STUDENT_CARD_START:
      return {
        ...state,
        fetchStudentCards: true,
      };
    case userConstants.GET_SELF_STUDENT_CARD_SUCCESS: {
      return {
        ...state,
        fetchStudentCards: false,
      };
    }
    case userConstants.GET_SELF_STUDENT_CARD_FAIL: {
      return {
        ...state,
        fetchStudentCards: false,
      };
    }
    case userConstants.ADD_SELF_STUDENT_CARD_START:
      return {
        ...state,
        addStudentCard: true,
      };
    case userConstants.ADD_SELF_STUDENT_CARD_SUCCESS: {
      return {
        ...state,
        addStudentCard: false,
      };
    }
    case userConstants.ADD_SELF_STUDENT_CARD_FAIL: {
      return {
        ...state,
        addStudentCard: false,
      };
    }
    case userConstants.EDIT_SELF_PASSWORD_START:
      return {
        ...state,
        editPassword: true,
      };
    case userConstants.EDIT_SELF_PASSWORD_SUCCESS: {
      return {
        ...state,
        editPassword: false,
      };
    }
    case userConstants.EDIT_SELF_PASSWORD_FAIL: {
      return {
        ...state,
        editPassword: false,
      };
    }

    case userConstants.BROWSE_SELF_PENDING_STUDENT_CARDS_START:
      return {
        ...state,
        browsePendingStudentCards: true,
      };
    case userConstants.BROWSE_SELF_PENDING_STUDENT_CARDS_SUCCESS:
      return {
        ...state,
        browsePendingStudentCards: false,
      };
    case userConstants.BROWSE_SELF_PENDING_STUDENT_CARDS_FAIL:
      return {
        ...state,
        browsePendingStudentCards: false,
      };

    case userConstants.RESEND_SELF_EMAIL_VERIFICATION_START:
      return {
        ...state,
        resendEmailVerification: true,
      };
    case userConstants.RESEND_SELF_EMAIL_VERIFICATION_SUCCESS:
      return {
        ...state,
        resendEmailVerification: false,
      };
    case userConstants.RESEND_SELF_EMAIL_VERIFICATION_FAIL:
      return {
        ...state,
        resendEmailVerification: false,
      };

    case userConstants.DELETE_SELF_PENDING_STUDENT_CARD_START:
      return {
        ...state,
        deletePendingStudentCard: true,
      };
    case userConstants.DELETE_SELF_PENDING_STUDENT_CARD_SUCCESS:
      return {
        ...state,
        deletePendingStudentCard: false,
      };
    case userConstants.DELETE_SELF_PENDING_STUDENT_CARD_FAIL:
      return {
        ...state,
        deletePendingStudentCard: false,
      };
    default: {
      return state;
    }
  }
}
