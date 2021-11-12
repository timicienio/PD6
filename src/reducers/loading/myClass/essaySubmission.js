import { essayConstants } from '../../../actions/myClass/constant';

const initialState = {
  uploadEssay: false,
  readEssaySubmission: false,
  reUploadEssay: false,
  downloadAllEssaySubmission: false,
  browseEssaySubmission: false,
};

export default function essaySubmission(state = initialState, action) {
  switch (action.type) {
    case essayConstants.UPLOAD_ESSAY_SUBMISSION_START: {
      return {
        ...state,
        uploadEssay: true,
      };
    }
    case essayConstants.UPLOAD_ESSAY_SUBMISSION_SUCCESS: {
      return {
        ...state,
        uploadEssay: true,
      };
    }
    case essayConstants.UPLOAD_ESSAY_SUBMISSION_FAIL: {
      return {
        ...state,
        uploadEssay: false,
      };
    }
    case essayConstants.READ_ESSAY_SUBMISSION_START: {
      return {
        ...state,
        readEssaySubmission: true,
      };
    }
    case essayConstants.READ_ESSAY_SUBMISSION_SUCCESS: {
      return {
        ...state,
        readEssaySubmission: true,
      };
    }
    case essayConstants.READ_ESSAY_SUBMISSION_FAIL: {
      return {
        ...state,
        readEssaySubmission: false,
      };
    }
    case essayConstants.RE_UPLOAD_ESSAY_SUBMISSION_START: {
      return {
        ...state,
        reUploadEssay: true,
      };
    }
    case essayConstants.RE_UPLOAD_ESSAY_SUBMISSION_SUCCESS: {
      return {
        ...state,
        reUploadEssay: true,
      };
    }
    case essayConstants.RE_UPLOAD_ESSAY_SUBMISSION_FAIL: {
      return {
        ...state,
        reUploadEssay: false,
      };
    }
    case essayConstants.DOWNLOAD_ALL_ESSAY_SUBMISSION_START: {
      return {
        ...state,
        downloadAllEssaySubmission: true,
      };
    }
    case essayConstants.DOWNLOAD_ALL_ESSAY_SUBMISSION_SUCCESS: {
      return {
        ...state,
        downloadAllEssaySubmission: true,
      };
    }
    case essayConstants.DOWNLOAD_ALL_ESSAY_SUBMISSION_FAIL: {
      return {
        ...state,
        downloadAllEssaySubmission: false,
      };
    }
    case essayConstants.BROWSE_ESSAY_SUBMISSION_START: {
      return {
        ...state,
        browseEssaySubmission: true,
      };
    }
    case essayConstants.BROWSE_ESSAY_SUBMISSION_SUCCESS: {
      return {
        ...state,
        browseEssaySubmission: true,
      };
    }
    case essayConstants.BROWSE_ESSAY_SUBMISSION_FAIL: {
      return {
        ...state,
        browseEssaySubmission: false,
      };
    }

    default: {
      return state;
    }
  }
}
