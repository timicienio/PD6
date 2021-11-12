import { combineReducers } from 'redux';
import { commonConstants } from '../actions/common/constant';

const byId = (state = {}, action) => {
  switch (action.type) {
    case commonConstants.FETCH_DOWNLOAD_FILE_URL_SUCCESS: {
      const { uuid, url } = action.payload;
      return {
        ...state,
        [uuid]: { url },
      };
    }

    default:
      return state;
  }
};

export default combineReducers({ byId });
