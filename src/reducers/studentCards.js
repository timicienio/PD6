import { combineReducers } from 'redux';
import { accountConstants } from '../actions/admin/constant';
import { userConstants } from '../actions/user/constants';

const byId = (state = {}, action) => {
  switch (action.type) {
    case accountConstants.FETCH_STUDENT_CARDS_SUCCESS: {
      const { data } = action.payload;
      return data.reduce((acc, item) => ({ ...acc, [item.id]: { ...item } }), {});
    }
    case accountConstants.MAKE_STUDENT_CARD_DEFAULT_SUCCESS: {
      const { cardId } = action.payload;
      return state.map((item) => {
        if (item.id !== cardId) {
          return { ...item, is_default: false };
        }
        return { ...item, is_default: true };
      });
    }
    case userConstants.MAKE_SELF_STUDENT_CARD_DEFAULT_SUCCESS: {
      const { cardId } = action.payload;
      return state.map((item) => {
        if (item.id !== cardId) {
          return { ...item, is_default: false };
        }
        return { ...item, is_default: true };
      });
    }
    case userConstants.GET_SELF_STUDENT_CARD_SUCCESS:
      return action.payload.reduce((acc, item) => ({ ...acc, [item.id]: { ...item } }), {});
    case userConstants.GET_SELF_STUDENT_CARD_FAIL:
      return {};
    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case accountConstants.FETCH_STUDENT_CARDS_SUCCESS: {
      const { data } = action.payload;
      return data.map((item) => item.id);
    }
    case userConstants.GET_SELF_STUDENT_CARD_SUCCESS:
      return action.payload.map((item) => item.id);
    case userConstants.GET_SELF_STUDENT_CARD_FAIL:
      return [];
    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
