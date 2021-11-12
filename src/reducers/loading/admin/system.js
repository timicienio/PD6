import { systemConstants } from '../../../actions/admin/constant';

const initialState = {
  fetchAccessLog: false,
  fetchAnnouncement: false,
  editAnnouncement: false,
  addAnnouncement: false,
  deleteAnnouncement: false,
  fetchSubmitLanguage: false,
  editSubmitLanguage: false,
};

export default function system(state = initialState, action) {
  switch (action.type) {
    /* Access Logs */
    case systemConstants.FETCH_ACCESS_LOG_START:
      return {
        ...state,
        fetchAccessLog: true,
      };
    case systemConstants.FETCH_ACCESS_LOG_SUCCESS: {
      return {
        ...state,
        fetchAccessLog: false,
      };
    }
    case systemConstants.FETCH_ACCESS_LOG_FAIL: {
      return {
        ...state,
        fetchAccessLog: false,
      };
    }
    /* Announcement */
    case systemConstants.FETCH_ANNOUNCEMENT_START:
      return {
        ...state,
        fetchAnnouncement: true,
      };
    case systemConstants.FETCH_ANNOUNCEMENT_SUCCESS: {
      return {
        ...state,
        fetchAnnouncement: false,
      };
    }
    case systemConstants.FETCH_ANNOUNCEMENT_FAIL: {
      return {
        ...state,
        fetchAnnouncement: false,
      };
    }
    case systemConstants.EDIT_ANNOUNCEMENT_START: {
      return {
        ...state,
        editAnnouncement: true,
      };
    }
    case systemConstants.EDIT_ANNOUNCEMENT_SUCCESS: {
      return {
        ...state,
        editAnnouncement: false,
      };
    }
    case systemConstants.EDIT_ANNOUNCEMENT_FAIL: {
      return {
        ...state,
        addAnnouncement: false,
      };
    }
    case systemConstants.ADD_ANNOUNCEMENT_START: {
      return {
        ...state,
        addAnnouncement: true,
      };
    }
    case systemConstants.ADD_ANNOUNCEMENT_SUCCESS: {
      return {
        ...state,
        addAnnouncement: false,
      };
    }
    case systemConstants.ADD_ANNOUNCEMENT_FAIL: {
      return {
        ...state,
        addAnnouncement: false,
      };
    }
    case systemConstants.DELETE_ANNOUNCEMENT_START: {
      return {
        ...state,
        deleteAnnouncement: true,
      };
    }
    case systemConstants.DELETE_ANNOUNCEMENT_SUCCESS: {
      return {
        ...state,
        deleteAnnouncement: false,
      };
    }
    case systemConstants.DELETE_ANNOUNCEMENT_FAIL: {
      return {
        ...state,
        deleteAnnouncement: false,
      };
    }
    /* SubmitLang */
    case systemConstants.FETCH_SUBMIT_LANGUAGE_START: {
      return {
        ...state,
        fetchSubmitLanguage: true,
      };
    }
    case systemConstants.FETCH_SUBMIT_LANGUAGE_SUCCESS: {
      return {
        ...state,
        fetchSubmitLanguage: false,
      };
    }
    case systemConstants.FETCH_SUBMIT_LANGUAGE_FAIL: {
      return {
        ...state,
        fetchSubmitLanguage: false,
      };
    }
    case systemConstants.EDIT_SUBMIT_LANGUAGE_START: {
      return {
        ...state,
        editSubmitLanguage: true,
      };
    }
    case systemConstants.EDIT_SUBMIT_LANGUAGE_SUCCESS: {
      return {
        ...state,
        editSubmitLanguage: false,
      };
    }
    case systemConstants.EDIT_SUBMIT_LANGUAGE_FAIL: {
      return {
        ...state,
        editSubmitLanguage: false,
      };
    }
    default: {
      return state;
    }
  }
}
