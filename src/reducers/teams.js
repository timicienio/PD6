import { combineReducers } from 'redux';
import { commonConstants } from '../actions/common/constant';
import { teamConstants } from '../actions/myClass/constant';

const byId = (state = {}, action) => {
  switch (action.type) {
    case teamConstants.FETCH_TEAMS_SUCCESS: {
      const { data } = action.payload;
      return data.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: {
            ...item,
            teamMemberIds: [],
            template: {},
            tempAddMember: [],
          },
        }),
        state,
      );
    }

    case teamConstants.FETCH_TEAM_SUCCESS: {
      const { teamId, data } = action.payload;
      return {
        ...state,
        [teamId]: {
          ...data,
          teamMemberIds: state[teamId] ? state[teamId].teamMemberIds : [],
          template: state[teamId] ? state[teamId].template : {},
          tempAddMember: [],
        },
      };
    }

    case teamConstants.FETCH_TEAM_MEMBERS_SUCCESS: {
      const { teamId, data } = action.payload;
      return { ...state, [teamId]: { ...state[teamId], teamMemberIds: data.map((item) => item.member_id) } };
    }

    case teamConstants.DOWNLOAD_TEAM_FILE_SUCCESS: {
      return { ...state, template: action.payload };
    }

    case commonConstants.GET_ACCOUNT_BATCH_BY_REFERRAL_SUCCESS: {
      const { teamId, memberId } = action.payload;
      return {
        ...state,
        [teamId]: { ...state[teamId], tempAddMember: [...state[teamId].tempAddMember, { id: memberId }] },
      };
    }

    default:
      return state;
  }
};

const allIds = (state = [], action) => {
  switch (action.type) {
    case teamConstants.FETCH_TEAMS_SUCCESS: {
      const { data } = action.payload;
      return data.map((item) => item.id);
    }
    case teamConstants.FETCH_TEAM_SUCCESS: {
      const { data } = action.payload;
      return state.includes(action.payload.id) ? state : state.concat([data.id]);
    }

    default:
      return state;
  }
};

export default combineReducers({ byId, allIds });
