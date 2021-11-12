import { essayConstants } from '../../../actions/myClass/constant';

const initialState = {
  readEssay: null,
  editEssay: null,
  deleteEssay: null,
};

export default function essay(state = initialState, action) {
  switch (action.type) {
    case essayConstants.READ_ESSAY_SUCCESS: {
      return {
        ...state,
        readEssay: null,
      };
    }
    case essayConstants.READ_ESSAY_FAIL: {
      return {
        ...state,
        readEssay: action.error,
      };
    }
    case essayConstants.EDIT_ESSAY_SUCCESS: {
      return {
        ...state,
        editEssay: null,
      };
    }
    case essayConstants.EDIT_ESSAY_FAIL: {
      return {
        ...state,
        editEssay: action.error,
      };
    }
    case essayConstants.DELETE_ESSAY_SUCCESS: {
      return {
        ...state,
        deleteEssay: null,
      };
    }
    case essayConstants.DELETE_ESSAY_FAIL: {
      return {
        ...state,
        deleteEssay: action.error,
      };
    }

    default: {
      return state;
    }
  }
}
