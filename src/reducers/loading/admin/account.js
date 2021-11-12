import { accountConstants } from '../../../actions/admin/constant';

const initialState = {
  fetchInstitute: false,
  addInstitute: false,
  editInstitute: false,

  fetchAccounts: false,
  fetchAccount: false,
  editAccount: false,
  deleteAccount: false,
  editPassword: false,

  fetchStudentCards: false,
  addStudentCard: false,
  makeStudentCardDefault: false,

  browsePendingStudentCards: false,
  resendEmailVerification: false,
  deletePendingStudentCard: false,

  addAccount: false,
  importAccount: false,
  downloadAccountFile: false,
};

export default function account(state = initialState, action) {
  switch (action.type) {
    case accountConstants.FETCH_INSTITUTE_START: {
      return {
        ...state,
        fetchInstitute: true,
      };
    }
    case accountConstants.FETCH_INSTITUTE_SUCCESS: {
      return {
        ...state,
        fetchInstitute: false,
      };
    }
    case accountConstants.FETCH_INSTITUTE_FAIL: {
      return {
        ...state,
        fetchInstitute: false,
      };
    }

    case accountConstants.ADD_INSTITUTE_START: {
      return {
        ...state,
        addInstitute: true,
      };
    }
    case accountConstants.ADD_INSTITUTE_SUCCESS: {
      return {
        ...state,
        addInstitute: false,
      };
    }
    case accountConstants.ADD_INSTITUTE_FAIL: {
      return {
        ...state,
        addInstitute: false,
      };
    }
    case accountConstants.EDIT_INSTITUTE_START: {
      return {
        ...state,
        editInstitute: true,
      };
    }
    case accountConstants.EDIT_INSTITUTE_SUCCESS: {
      return {
        ...state,
        editInstitute: false,
      };
    }
    case accountConstants.EDIT_INSTITUTE_FAIL: {
      return {
        ...state,
        editInstitute: false,
      };
    }

    case accountConstants.FETCH_ACCOUNTS_START: {
      return {
        ...state,
        fetchAccounts: true,
      };
    }
    case accountConstants.FETCH_ACCOUNTS_SUCCESS: {
      return {
        ...state,
        fetchAccounts: false,
      };
    }
    case accountConstants.FETCH_ACCOUNTS_FAIL: {
      return {
        ...state,
        fetchAccounts: false,
      };
    }

    case accountConstants.FETCH_ACCOUNT_START: {
      return {
        ...state,
        fetchAccount: true,
      };
    }
    case accountConstants.FETCH_ACCOUNT_SUCCESS: {
      return {
        ...state,
        fetchAccount: false,
      };
    }
    case accountConstants.FETCH_ACCOUNT_FAIL: {
      return {
        ...state,
        fetchAccount: false,
      };
    }

    case accountConstants.EDIT_ACCOUNT_START: {
      return {
        ...state,
        editAccount: true,
      };
    }
    case accountConstants.EDIT_ACCOUNT_SUCCESS: {
      return {
        ...state,
        editAccount: false,
      };
    }
    case accountConstants.EDIT_ACCOUNT_FAIL: {
      return {
        ...state,
        editAccount: false,
      };
    }

    case accountConstants.DELETE_ACCOUNT_START: {
      return {
        ...state,
        deleteAccount: true,
      };
    }
    case accountConstants.DELETE_ACCOUNT_SUCCESS: {
      return {
        ...state,
        deleteAccount: false,
      };
    }
    case accountConstants.DELETE_ACCOUNT_FAIL: {
      return {
        ...state,
        deleteAccount: false,
      };
    }

    case accountConstants.EDIT_PASSWORD_START: {
      return {
        ...state,
        editPassword: true,
      };
    }
    case accountConstants.EDIT_PASSWORD_SUCCESS: {
      return {
        ...state,
        editPassword: false,
      };
    }
    case accountConstants.EDIT_PASSWORD_FAIL: {
      return {
        ...state,
        editPassword: false,
      };
    }

    case accountConstants.FETCH_STUDENT_CARDS_START: {
      return {
        ...state,
        fetchStudentCards: true,
      };
    }
    case accountConstants.FETCH_STUDENT_CARDS_SUCCESS: {
      return {
        ...state,
        fetchStudentCards: false,
      };
    }
    case accountConstants.FETCH_STUDENT_CARDS_FAIL: {
      return {
        ...state,
        fetchStudentCards: false,
      };
    }

    case accountConstants.ADD_STUDENT_CARD_START: {
      return {
        ...state,
        addStudentCard: true,
      };
    }
    case accountConstants.ADD_STUDENT_CARD_SUCCESS: {
      return {
        ...state,
        addStudentCard: false,
      };
    }
    case accountConstants.ADD_STUDENT_CARD_FAIL: {
      return {
        ...state,
        addStudentCard: false,
      };
    }

    case accountConstants.MAKE_STUDENT_CARD_DEFAULT_START: {
      return {
        ...state,
        makeStudentCardDefault: true,
      };
    }
    case accountConstants.MAKE_STUDENT_CARD_DEFAULT_SUCCESS: {
      return {
        ...state,
        makeStudentCardDefault: false,
      };
    }
    case accountConstants.MAKE_STUDENT_CARD_DEFAULT_FAIL: {
      return {
        ...state,
        makeStudentCardDefault: false,
      };
    }

    case accountConstants.BROWSE_PENDING_STUDENT_CARDS_START: {
      return {
        ...state,
        browsePendingStudentCards: true,
      };
    }
    case accountConstants.BROWSE_PENDING_STUDENT_CARDS_SUCCESS: {
      return {
        ...state,
        browsePendingStudentCards: false,
      };
    }
    case accountConstants.BROWSE_PENDING_STUDENT_CARDS_FAIL: {
      return {
        ...state,
        browsePendingStudentCards: false,
      };
    }

    case accountConstants.RESEND_EMAIL_VERIFICATION_START: {
      return {
        ...state,
        resendEmailVerification: true,
      };
    }
    case accountConstants.RESEND_EMAIL_VERIFICATION_SUCCESS: {
      return {
        ...state,
        resendEmailVerification: false,
      };
    }
    case accountConstants.RESEND_EMAIL_VERIFICATION_FAIL: {
      return {
        ...state,
        resendEmailVerification: false,
      };
    }

    case accountConstants.DELETE_PENDING_STUDENT_CARD_START: {
      return {
        ...state,
        deletePendingStudentCard: true,
      };
    }
    case accountConstants.DELETE_PENDING_STUDENT_CARD_SUCCESS: {
      return {
        ...state,
        deletePendingStudentCard: false,
      };
    }
    case accountConstants.DELETE_PENDING_STUDENT_CARD_FAIL: {
      return {
        ...state,
        deletePendingStudentCard: false,
      };
    }

    case accountConstants.ADD_ACCOUNT_START: {
      return {
        ...state,
        addAccount: true,
      };
    }
    case accountConstants.ADD_ACCOUNT_SUCCESS: {
      return {
        ...state,
        addAccount: false,
      };
    }
    case accountConstants.ADD_ACCOUNT_FAIL: {
      return {
        ...state,
        addAccount: false,
      };
    }

    case accountConstants.IMPORT_ACCOUNT_START: {
      return {
        ...state,
        importAccount: true,
      };
    }
    case accountConstants.IMPORT_ACCOUNT_SUCCESS: {
      return {
        ...state,
        importAccount: false,
      };
    }
    case accountConstants.IMPORT_ACCOUNT_FAIL: {
      return {
        ...state,
        importAccount: false,
      };
    }

    case accountConstants.DOWNLOAD_ACCOUNT_FILE_START: {
      return {
        ...state,
        downloadAccountFile: true,
      };
    }
    case accountConstants.DOWNLOAD_ACCOUNT_FILE_SUCCESS: {
      return {
        ...state,
        downloadAccountFile: false,
      };
    }
    case accountConstants.DOWNLOAD_ACCOUNT_FILE_FAIL: {
      return {
        ...state,
        downloadAccountFile: false,
      };
    }

    default: {
      return state;
    }
  }
}
