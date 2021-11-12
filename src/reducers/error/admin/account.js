import { accountConstants } from '../../../actions/admin/constant';

const initialState = {
  fetchInstitute: null,
  addInstitute: null,
  editInstitute: null,

  fetchAccounts: null,
  fetchAccount: null,
  editAccount: null,
  deleteAccount: null,
  editPassword: null,

  fetchStudentCards: null,
  addStudentCard: null,
  makeStudentCardDefault: null,

  browsePendingStudentCards: null,
  resendEmailVerification: null,
  deletePendingStudentCard: null,

  addAccount: null,
  importAccount: null,
  downloadAccountFile: null,
};

export default function account(state = initialState, action) {
  switch (action.type) {
    case accountConstants.FETCH_INSTITUTE_SUCCESS: {
      return {
        ...state,
        fetchInstitute: null,
      };
    }
    case accountConstants.FETCH_INSTITUTE_FAIL: {
      const { error } = action;
      return {
        ...state,
        fetchInstitute: error,
      };
    }

    case accountConstants.ADD_INSTITUTE_SUCCESS: {
      return {
        ...state,
        addInstitute: null,
      };
    }
    case accountConstants.ADD_INSTITUTE_FAIL: {
      const { error } = action;
      return {
        ...state,
        addInstitute: error,
      };
    }

    case accountConstants.EDIT_INSTITUTE_SUCCESS: {
      return {
        ...state,
        editInstitute: null,
      };
    }
    case accountConstants.EDIT_INSTITUTE_FAIL: {
      const { error } = action;
      return {
        ...state,
        editInstitute: error,
      };
    }

    case accountConstants.FETCH_ACCOUNTS_SUCCESS: {
      return {
        ...state,
        fetchAccounts: null,
      };
    }
    case accountConstants.FETCH_ACCOUNTS_FAIL: {
      return {
        ...state,
        fetchAccounts: action.error,
      };
    }

    case accountConstants.FETCH_ACCOUNT_SUCCESS: {
      return {
        ...state,
        fetchAccount: null,
      };
    }
    case accountConstants.FETCH_ACCOUNT_FAIL: {
      return {
        ...state,
        fetchAccount: action.error,
      };
    }

    case accountConstants.EDIT_ACCOUNT_SUCCESS: {
      return {
        ...state,
        editAccount: null,
      };
    }
    case accountConstants.EDIT_ACCOUNT_FAIL: {
      return {
        ...state,
        editAccount: action.error,
      };
    }

    case accountConstants.DELETE_ACCOUNT_SUCCESS: {
      return {
        ...state,
        deleteAccount: null,
      };
    }
    case accountConstants.DELETE_ACCOUNT_FAIL: {
      return {
        ...state,
        deleteAccount: action.error,
      };
    }

    case accountConstants.EDIT_PASSWORD_SUCCESS: {
      return {
        ...state,
        editPassword: null,
      };
    }
    case accountConstants.EDIT_PASSWORD_FAIL: {
      return {
        ...state,
        editPassword: action.error,
      };
    }

    case accountConstants.FETCH_STUDENT_CARDS_SUCCESS: {
      return {
        ...state,
        fetchStudentCards: null,
      };
    }
    case accountConstants.FETCH_STUDENT_CARDS_FAIL: {
      return {
        ...state,
        fetchStudentCards: action.error,
      };
    }

    case accountConstants.ADD_STUDENT_CARD_SUCCESS: {
      return {
        ...state,
        addStudentCard: null,
      };
    }
    case accountConstants.ADD_STUDENT_CARD_FAIL: {
      return {
        ...state,
        addStudentCard: action.error,
      };
    }

    case accountConstants.MAKE_STUDENT_CARD_DEFAULT_SUCCESS: {
      return {
        ...state,
        makeStudentCardDefault: null,
      };
    }
    case accountConstants.MAKE_STUDENT_CARD_DEFAULT_FAIL: {
      return {
        ...state,
        makeStudentCardDefault: action.error,
      };
    }

    case accountConstants.BROWSE_PENDING_STUDENT_CARDS_SUCCESS: {
      return {
        ...state,
        browsePendingStudentCards: null,
      };
    }
    case accountConstants.BROWSE_PENDING_STUDENT_CARDS_FAIL: {
      return {
        ...state,
        browsePendingStudentCards: action.error,
      };
    }

    case accountConstants.RESEND_EMAIL_VERIFICATION_SUCCESS: {
      return {
        ...state,
        resendEmailVerification: null,
      };
    }
    case accountConstants.RESEND_EMAIL_VERIFICATION_FAIL: {
      return {
        ...state,
        resendEmailVerification: action.error,
      };
    }

    case accountConstants.DELETE_PENDING_STUDENT_CARD_SUCCESS: {
      return {
        ...state,
        deletePendingStudentCard: null,
      };
    }
    case accountConstants.DELETE_PENDING_STUDENT_CARD_FAIL: {
      return {
        ...state,
        deletePendingStudentCard: action.error,
      };
    }

    case accountConstants.ADD_ACCOUNT_START: {
      return {
        ...state,
        addAccount: null,
      };
    }
    case accountConstants.ADD_ACCOUNT_FAIL: {
      return {
        ...state,
        addAccount: action.error,
      };
    }

    case accountConstants.IMPORT_ACCOUNT_START: {
      return {
        ...state,
        importAccount: null,
      };
    }
    case accountConstants.IMPORT_ACCOUNT_FAIL: {
      return {
        ...state,
        importAccount: action.error,
      };
    }

    case accountConstants.DOWNLOAD_ACCOUNT_FILE_START: {
      return {
        ...state,
        downloadAccountFile: null,
      };
    }
    case accountConstants.DOWNLOAD_ACCOUNT_FILE_FAIL: {
      return {
        ...state,
        downloadAccountFile: action.error,
      };
    }

    default: {
      return state;
    }
  }
}
