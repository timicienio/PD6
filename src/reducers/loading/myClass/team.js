import { teamConstants } from '../../../actions/myClass/constant';

const initialState = {
  fetchTeams: false,
  fetchTeam: false,
  addTeam: false,
  importTeam: false,
  editTeam: false,
  deleteTeam: false,

  fetchTeamMember: false,
  addTeamMember: false,
  editTeamMember: false,
  deleteTeamMember: false,
};

export default function team(state = initialState, action) {
  switch (action.type) {
    case teamConstants.FETCH_TEAMS_START: {
      return {
        ...state,
        fetchTeams: true,
      };
    }
    case teamConstants.FETCH_TEAMS_SUCCESS: {
      return {
        ...state,
        fetchTeams: false,
      };
    }
    case teamConstants.FETCH_TEAMS_FAIL: {
      return {
        ...state,
        fetchTeams: false,
      };
    }

    case teamConstants.FETCH_TEAM_START: {
      return {
        ...state,
        fetchTeam: true,
      };
    }
    case teamConstants.FETCH_TEAM_SUCCESS: {
      return {
        ...state,
        fetchTeam: false,
      };
    }
    case teamConstants.FETCH_TEAM_FAIL: {
      return {
        ...state,
        fetchTeam: false,
      };
    }

    case teamConstants.ADD_TEAM_START: {
      return {
        ...state,
        addTeam: true,
      };
    }
    case teamConstants.ADD_TEAM_SUCCESS: {
      return {
        ...state,
        addTeam: false,
      };
    }
    case teamConstants.ADD_TEAM_FAIL: {
      return {
        ...state,
        addTeam: false,
      };
    }

    case teamConstants.IMPORT_TEAM_START: {
      return {
        ...state,
        importTeam: true,
      };
    }
    case teamConstants.IMPORT_TEAM_SUCCESS: {
      return {
        ...state,
        importTeam: false,
      };
    }
    case teamConstants.IMPORT_TEAM_FAIL: {
      return {
        ...state,
        importTeam: false,
      };
    }

    case teamConstants.EDIT_TEAM_START: {
      return {
        ...state,
        editTeam: true,
      };
    }
    case teamConstants.EDIT_TEAM_SUCCESS: {
      return {
        ...state,
        editTeam: false,
      };
    }
    case teamConstants.EDIT_TEAM_FAIL: {
      return {
        ...state,
        editTeam: false,
      };
    }

    case teamConstants.DELETE_TEAM_START: {
      return {
        ...state,
        deleteTeam: true,
      };
    }
    case teamConstants.DELETE_TEAM_SUCCESS: {
      return {
        ...state,
        deleteTeam: false,
      };
    }
    case teamConstants.DELETE_TEAM_FAIL: {
      return {
        ...state,
        deleteTeam: false,
      };
    }

    case teamConstants.FETCH_TEAM_MEMBERS_START: {
      return {
        ...state,
        fetchTeamMember: true,
      };
    }
    case teamConstants.FETCH_TEAM_MEMBERS_SUCCESS: {
      return {
        ...state,
        fetchTeamMember: false,
      };
    }
    case teamConstants.FETCH_TEAM_MEMBERS_FAIL: {
      return {
        ...state,
        fetchTeamMember: false,
      };
    }

    case teamConstants.ADD_TEAM_MEMBER_START: {
      return {
        ...state,
        addTeamMember: true,
      };
    }
    case teamConstants.ADD_TEAM_MEMBER_SUCCESS: {
      return {
        ...state,
        addTeamMember: false,
      };
    }
    case teamConstants.ADD_TEAM_MEMBER_FAIL: {
      return {
        ...state,
        addTeamMember: false,
      };
    }

    case teamConstants.EDIT_TEAM_MEMBER_START: {
      return {
        ...state,
        editTeamMember: true,
      };
    }
    case teamConstants.EDIT_TEAM_MEMBER_SUCCESS: {
      return {
        ...state,
        editTeamMember: false,
      };
    }
    case teamConstants.EDIT_TEAM_MEMBER_FAIL: {
      return {
        ...state,
        editTeamMember: false,
      };
    }

    case teamConstants.DELETE_TEAM_MEMBER_START: {
      return {
        ...state,
        deleteTeamMember: true,
      };
    }
    case teamConstants.DELETE_TEAM_MEMBER_SUCCESS: {
      return {
        ...state,
        deleteTeamMember: false,
      };
    }
    case teamConstants.DELETE_TEAM_MEMBER_FAIL: {
      return {
        ...state,
        deleteTeamMember: false,
      };
    }

    default:
      return state;
  }
}
