import { essayConstants } from '../../../actions/myClass/constant';

const initialState = {
  uploadEssay: null,
  readEssayubmission: null,
  reUploadEssay: null,
  downloadAllEssaySubmission: null,
  browseEssaySubmission: null,
};

export default function essaySubmission(state = initialState, action) {
  switch (action.type) {
    case essayConstants.UPLOAD_ESSAY_SUBMISSION_SUCCESS: {
      return {
        ...state,
        uploadEssay: null,
      };
    }
    case essayConstants.UPLOAD_ESSAY_SUBMISSION_FAIL: {
      return {
        ...state,
        uploadEssay: action.error,
      };
    }
    case essayConstants.READ_ESSAY_SUBMISSION_SUCCESS: {
      return {
        ...state,
        readEssayubmission: null,
      };
    }
    case essayConstants.READ_ESSAY_SUBMISSION_FAIL: {
      return {
        ...state,
        readEssayubmission: action.error,
      };
    }
    case essayConstants.RE_UPLOAD_ESSAY_SUBMISSION_SUCCESS: {
      return {
        ...state,
        reUploadEssay: null,
      };
    }
    case essayConstants.RE_UPLOAD_ESSAY_SUBMISSION_FAIL: {
      return {
        ...state,
        reUploadEssay: action.error,
      };
    }
    case essayConstants.DOWNLOAD_ALL_ESSAY_SUBMISSION_SUCCESS: {
      return {
        ...state,
        downloadAllEssaySubmission: null,
      };
    }
    case essayConstants.DOWNLOAD_ALL_ESSAY_SUBMISSION_FAIL: {
      return {
        ...state,
        downloadAllEssaySubmission: action.error,
      };
    }
    case essayConstants.BROWSE_ESSAY_SUBMISSION_SUCCESS: {
      return {
        ...state,
        browseEssaySubmission: null,
      };
    }
    case essayConstants.BROWSE_ESSAY_SUBMISSION_FAIL: {
      return {
        ...state,
        browseEssaySubmission: action.error,
      };
    }

    default: {
      return state;
    }
  }
}
