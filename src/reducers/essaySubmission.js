import { combineReducers } from 'redux';
import { essayConstants } from '../actions/myClass/constant';

const byId = (state = {}, action) => {
  switch (action.type) {
    case essayConstants.UPLOAD_ESSAY_SUBMISSION_SUCCESS: {
      const data = action.payload;
      return { ...state, [data.id]: data };
    }
    case essayConstants.READ_ESSAY_SUBMISSION_SUCCESS: {
      const data = action.payload;
      return {
        ...state,
        [data.id]: data,
      };
    }
    case essayConstants.READ_ESSAY_SUCCESS: {
      const { submission } = action.payload;
      if (submission.length === 0) {
        return state;
      }
      return {
        ...state,
        [submission[0].id]: submission[0],
      };
    }
    // case essayConstants.BROWSE_ESSAY_SUBMISSION_SUCCESS: {
    //   const data = action.payload;
    //   return data.reduce(
    //     (acc, item) => ({
    //       ...acc,
    //       [item.id]: {
    //         ...item,
    //       },
    //     }),
    //     state,
    //   );
    // }

    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case essayConstants.READ_ESSAY_SUBMISSION_SUCCESS:
      return state.includes(action.payload.id) ? state : state.concat([action.payload.id]);
    case essayConstants.UPLOAD_ESSAY_SUBMISSION_SUCCESS:
      return state.includes(action.payload.id) ? state : state.concat([action.payload.id]);
      // case essayConstants.BROWSE_ESSAY_SUBMISSION_SUCCESS:
      //   return action.payload.map((item) => item.id);
    case essayConstants.READ_ESSAY_SUCCESS: {
      const { submission } = action.payload;
      if (submission.length === 0) {
        return state;
      }
      return state.includes(submission[0].id) ? state : state.concat([submission[0].id]);
    }
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
