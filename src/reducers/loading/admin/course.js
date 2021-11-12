import { courseConstants } from '../../../actions/admin/constant';

const initialState = {
  fetchCourses: false,
  addCourse: false,
  renameCourse: false,
  deleteCourse: false,

  fetchClasses: false,
  addClass: false,
  renameClass: false,
  deleteClass: false,

  fetchMembers: false,
  editMembers: false,
};

export default function course(state = initialState, action) {
  switch (action.type) {
    /* Courses */
    case courseConstants.FETCH_COURSES_START:
      return {
        ...state,
        fetchCourses: true,
      };
    case courseConstants.FETCH_COURSES_SUCCESS: {
      return {
        ...state,
        fetchCourses: false,
      };
    }
    case courseConstants.FETCH_COURSES_FAIL: {
      return {
        ...state,
        fetchCourses: false,
      };
    }

    case courseConstants.ADD_COURSE_START: {
      return {
        ...state,
        addCourse: true,
      };
    }
    case courseConstants.ADD_COURSE_SUCCESS: {
      return {
        ...state,
        addCourse: false,
      };
    }
    case courseConstants.ADD_COURSE_FAIL: {
      return {
        ...state,
        addCourse: false,
      };
    }

    case courseConstants.RENAME_COURSE_START: {
      return {
        ...state,
        renameCourse: true,
      };
    }
    case courseConstants.RENAME_COURSE_SUCCESS: {
      return {
        ...state,
        renameCourse: false,
      };
    }
    case courseConstants.RENAME_COURSE_FAIL: {
      return {
        ...state,
        renameCourse: false,
      };
    }

    case courseConstants.DELETE_COURSE_START: {
      return {
        ...state,
        deleteCourse: true,
      };
    }
    case courseConstants.DELETE_COURSE_SUCCESS: {
      return {
        ...state,
        deleteCourse: false,
      };
    }
    case courseConstants.DELETE_COURSE_FAIL: {
      return {
        ...state,
        deleteCourse: false,
      };
    }

    /* Classes */
    case courseConstants.FETCH_CLASSES_START:
      return {
        ...state,
        fetchClasses: true,
      };

    case courseConstants.FETCH_CLASSES_SUCCESS: {
      return {
        ...state,
        fetchClasses: false,
      };
    }

    case courseConstants.FETCH_CLASSES_FAIL: {
      return {
        ...state,
        fetchClasses: false,
      };
    }

    case courseConstants.ADD_CLASS_START: {
      return { ...state, addClass: true };
    }
    case courseConstants.ADD_CLASS_SUCCESS: {
      return {
        ...state,
        addClass: false,
      };
    }
    case courseConstants.ADD_CLASS_FAIL: {
      return {
        ...state,
        addClass: false,
      };
    }

    case courseConstants.RENAME_CLASS_START: {
      return {
        ...state,
        renameClass: true,
      };
    }
    case courseConstants.RENAME_CLASS_SUCCESS: {
      return {
        ...state,
        renameClass: false,
      };
    }
    case courseConstants.RENAME_CLASS_FAIL: {
      return {
        ...state,
        renameClass: false,
      };
    }

    case courseConstants.DELETE_CLASS_START: {
      return {
        ...state,
        deleteClass: true,
      };
    }
    case courseConstants.DELETE_CLASS_SUCCESS: {
      return {
        ...state,
        deleteClass: false,
      };
    }
    case courseConstants.DELETE_CLASS_FAIL: {
      return {
        ...state,
        deleteClass: false,
      };
    }

    default: {
      return state;
    }
  }
}
