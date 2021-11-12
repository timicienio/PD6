import { combineReducers } from 'redux';
import { courseConstants } from '../actions/admin/constant';
import { commonConstants } from '../actions/common/constant';
import { viewConstants } from '../actions/api/constant';

const prototype = {
  id: null,
  name: null,
  type: null,
  is_deleted: null,
  classIds: [],
};

const byId = (state = {}, action) => {
  switch (action.type) {
    case courseConstants.FETCH_COURSES_SUCCESS: {
      const { data } = action.payload;
      return data.reduce(
        (acc, item) => ({
          ...acc,
          // classIds of existing courses are unchanged
          [item.id]: { ...item, classIds: state[item.id] ? state[item.id].classIds : [] },
        }),
        {},
      );
    }
    case commonConstants.FETCH_COURSE_SUCCESS: {
      return {
        ...state,
        [action.payload.id]: {
          ...action.payload,
          classIds: state[action.payload.id] ? state[action.payload.id].classIds : [],
        },
      };
    }
    case courseConstants.FETCH_CLASSES_SUCCESS: {
      const {
        courseId,
        data: { data },
      } = action.payload;
      return {
        ...state,
        [courseId]: { ...state[courseId], classIds: data.map((item) => item.id) },
      };
    }
    case commonConstants.FETCH_ALL_CLASSES_SUCCESS: {
      const { data } = action.payload;
      return data.reduce(
        (acc, { id, course_id }) => ({
          ...acc,
          [course_id]: {
            ...state[course_id],
            classIds: state[course_id].concat([id]),
          },
        }),
        state,
      );
    }
    case viewConstants.BROWSE_MY_SUBMISSION_SUCCESS: {
      const { courses } = action.payload.data;
      return courses.reduce((acc, item) => ({ ...acc, [item.id]: { ...prototype, ...item } }), state);
    }
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case courseConstants.FETCH_COURSES_SUCCESS: {
      const { data } = action.payload;
      return data.map((item) => item.id);
    }
    case commonConstants.FETCH_COURSE_SUCCESS: {
      const { id } = action.payload;
      return [...new Set([...state, id])];
    }
    case viewConstants.BROWSE_MY_SUBMISSION_SUCCESS: {
      const { courses } = action.payload.data;
      return [...new Set([...courses.map((item) => item.id), ...state])];
    }
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
