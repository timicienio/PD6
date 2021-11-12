import { combineReducers } from 'redux';
import { teamConstants } from '../actions/myClass/constant';

const byId = (state = {}, action) => {
  switch (action.type) {
    case teamConstants.FETCH_TEAM_MEMBERS_SUCCESS: {
      const { data, accounts } = action.payload;
      return data.reduce(
        (acc, item) => ({
          ...acc,
          [item.member_id]: {
            ...item,
            account: accounts.find((account) => account.id === item.member_id),
          },
        }),
        state,
      );
    }

    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case teamConstants.FETCH_TEAM_MEMBERS_SUCCESS: {
      const { data } = action.payload;
      return data.map((item) => item.member_id);
    }

    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
