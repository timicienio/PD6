import { essayConstants } from '../../../actions/myClass/constant';

const initialState = {
  readEssay: false,
  editEssay: false,
  deleteEssay: false,
};

export default function essay(state = initialState, action) {
  switch (action.type) {
    case essayConstants.READ_ESSAY_START: {
      return {
        ...state,
        readEssay: true,
      };
    }
    case essayConstants.READ_ESSAY_SUCCESS: {
      return {
        ...state,
        readEssay: true,
      };
    }
    case essayConstants.READ_ESSAY_FAIL: {
      return {
        ...state,
        readEssay: false,
      };
    }
    case essayConstants.EDIT_ESSAY_START: {
      return {
        ...state,
        editEssay: true,
      };
    }
    case essayConstants.EDIT_ESSAY_SUCCESS: {
      return {
        ...state,
        editEssay: false,
      };
    }
    case essayConstants.EDIT_ESSAY_FAIL: {
      return {
        ...state,
        editEssay: false,
      };
    }
    case essayConstants.DELETE_ESSAY_START: {
      return {
        ...state,
        deleteEssay: true,
      };
    }
    case essayConstants.DELETE_ESSAY_SUCCESS: {
      return {
        ...state,
        deleteEssay: false,
      };
    }
    case essayConstants.DELETE_ESSAY_FAIL: {
      return {
        ...state,
        deleteEssay: false,
      };
    }

    default: {
      return state;
    }
  }
}
