import { gradeConstants } from '../../../actions/myClass/constant';
import { viewConstants } from '../../../actions/api/constant';

const initialState = {
  fetchGrade: null,
  browseClassGrade: null,
  addClassGrade: null,
  importClassGrade: null,
  fetchAccountGrade: null,
  downloadGradeFile: null,
  deleteGrade: null,
  editGrade: null,
};

export default function grade(state = initialState, action) {
  switch (action.type) {
    case gradeConstants.FETCH_GRADE_SUCCESS: {
      return {
        ...state,
        fetchGrade: null,
      };
    }
    case gradeConstants.FETCH_GRADE_FAIL: {
      return {
        ...state,
        fetchGrade: action.error,
      };
    }
    case viewConstants.BROWSE_CLASS_GRADE_SUCCESS: {
      return {
        ...state,
        browseClassGrade: null,
      };
    }
    case viewConstants.BROWSE_CLASS_GRADE_FAIL: {
      return {
        ...state,
        browseClassGrade: action.error,
      };
    }

    case gradeConstants.ADD_CLASS_GRADE_SUCCESS: {
      return {
        ...state,
        addClassGrade: null,
      };
    }
    case gradeConstants.ADD_CLASS_GRADE_FAIL: {
      return {
        ...state,
        addClassGrade: action.error,
      };
    }

    case gradeConstants.IMPORT_CLASS_GRADE_SUCCESS: {
      return {
        ...state,
        importClassGrade: null,
      };
    }
    case gradeConstants.IMPORT_CLASS_GRADE_FAIL: {
      return {
        ...state,
        importClassGrade: action.error,
      };
    }

    case gradeConstants.FETCH_ACCOUNT_GRADE_SUCCESS: {
      return {
        ...state,
        fetchAccountGrade: null,
      };
    }
    case gradeConstants.FETCH_ACCOUNT_GRADE_FAIL: {
      return {
        ...state,
        fetchAccountGrade: action.error,
      };
    }

    case gradeConstants.DOWNLOAD_GRADE_FILE_SUCCESS: {
      return {
        ...state,
        downloadGradeFile: null,
      };
    }
    case gradeConstants.DOWNLOAD_GRADE_FILE_FAIL: {
      return {
        ...state,
        downloadGradeFile: action.error,
      };
    }

    case gradeConstants.DELETE_GRADE_SUCCESS: {
      return {
        ...state,
        deleteGrade: null,
      };
    }
    case gradeConstants.DELETE_GRADE_FAIL: {
      return {
        ...state,
        deleteGrade: action.error,
      };
    }

    case gradeConstants.EDIT_GRADE_SUCCESS: {
      return {
        ...state,
        editGrade: null,
      };
    }
    case gradeConstants.EDIT_GRADE_FAIL: {
      return {
        ...state,
        editGrade: action.error,
      };
    }

    default: {
      return state;
    }
  }
}
