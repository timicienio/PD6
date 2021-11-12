import { systemConstants } from '../../../actions/admin/constant';

const initialState = {
  fetchAccessLog: null,
  fetchAnnouncement: null,
  editAnnouncement: null,
  addAnnouncement: null,
  deleteAnnouncement: null,
  fetchSubmitLanguage: null,
  editSubmitLanguage: null,
};

export default function system(state = initialState, action) {
  switch (action.type) {
    /* Access Logs */
    case systemConstants.FETCH_ACCESS_LOG_SUCCESS: {
      return {
        ...state,
        fetchAccessLog: null,
      };
    }
    case systemConstants.FETCH_ACCESS_LOG_FAIL: {
      return {
        ...state,
        fetchAccessLog: action.error,
      };
    }
    /* Announcement */
    case systemConstants.FETCH_ANNOUNCEMENT_SUCCESS: {
      return {
        ...state,
        fetchAnnouncement: null,
      };
    }
    case systemConstants.FETCH_ANNOUNCEMENT_FAIL: {
      return {
        ...state,
        fetchAnnouncement: action.error,
      };
    }
    case systemConstants.EDIT_ANNOUNCEMENT_SUCCESS: {
      return {
        ...state,
        editAnnouncement: null,
      };
    }
    case systemConstants.EDIT_ANNOUNCEMENT_FAIL: {
      return {
        ...state,
        addAnnouncement: action.error,
      };
    }
    case systemConstants.ADD_ANNOUNCEMENT_SUCCESS: {
      return {
        ...state,
        addAnnouncement: null,
      };
    }
    case systemConstants.ADD_ANNOUNCEMENT_FAIL: {
      return {
        ...state,
        addAnnouncement: action.error,
      };
    }
    case systemConstants.DELETE_ANNOUNCEMENT_SUCCESS: {
      return {
        ...state,
        deleteAnnouncement: null,
      };
    }
    case systemConstants.DELETE_ANNOUNCEMENT_FAIL: {
      return {
        ...state,
        deleteAnnouncement: action.error,
      };
    }
    /* SubmitLang */
    case systemConstants.FETCH_SUBMIT_LANGUAGE_SUCCESS: {
      return {
        ...state,
        fetchSubmitLanguage: null,
      };
    }
    case systemConstants.FETCH_SUBMIT_LANGUAGE_FAIL: {
      return {
        ...state,
        fetchSubmitLanguage: action.error,
      };
    }
    case systemConstants.EDIT_SUBMIT_LANGUAGE_SUCCESS: {
      return {
        ...state,
        editSubmitLanguage: null,
      };
    }
    case systemConstants.EDIT_SUBMIT_LANGUAGE_FAIL: {
      return {
        ...state,
        editSubmitLanguage: action.error,
      };
    }
    default: {
      return state;
    }
  }
}
