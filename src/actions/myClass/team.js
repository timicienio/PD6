import agent from '../agent';
import { teamConstants } from './constant';
import { autoTableConstants } from '../component/constant';
import browseParamsTransForm from '../../function/browseParamsTransform';

// WITH BROWSE PARAMS
export const fetchTeams = (token, classId, browseParams, tableId = null) => async (dispatch) => {
  try {
    const config = {
      headers: { 'auth-token': token },
      params: browseParamsTransForm(browseParams),
    };
    dispatch({ type: teamConstants.FETCH_TEAMS_START });
    const res = await agent.get(`/class/${classId}/team`, config);
    const { data, total_count } = res.data.data;

    dispatch({
      type: teamConstants.FETCH_TEAMS_SUCCESS,
      payload: { data },
    });
    dispatch({
      type: autoTableConstants.AUTO_TABLE_UPDATE,
      payload: {
        tableId,
        totalCount: total_count,
        dataIds: data.map((item) => item.id),
        offset: browseParams.offset,
      },
    });
  } catch (error) {
    dispatch({
      type: teamConstants.FETCH_TEAMS_FAIL,
      error,
    });
  }
};

export const fetchTeam = (token, teamId) => async (dispatch) => {
  try {
    const config = { headers: { 'auth-token': token } };
    dispatch({ type: teamConstants.FETCH_TEAM_START });
    const res = await agent.get(`/team/${teamId}`, config);
    dispatch({
      type: teamConstants.FETCH_TEAM_SUCCESS,
      payload: { teamId, data: res.data.data },
    });
  } catch (error) {
    dispatch({
      type: teamConstants.FETCH_TEAM_FAIL,
      error,
    });
  }
};

export const addTeam = (token, classId, name, label, onSuccess, onError) => async (dispatch) => {
  try {
    const config = { headers: { 'auth-token': token } };
    dispatch({ type: teamConstants.ADD_TEAM_MEMBER_START });
    await agent.post(`/class/${classId}/team`, { name, label }, config);
    dispatch({ type: teamConstants.ADD_TEAM_MEMBER_SUCCESS });
    onSuccess();
  } catch (error) {
    dispatch({
      type: teamConstants.ADD_TEAM_MEMBER_FAIL,
      error,
    });
    onError();
  }
};

export const importTeam = (token, classId, label, file, onSuccess, onError) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
        'Content-Type': 'multipart/form-data',
      },
      params: { label },
    };
    const formData = new FormData();
    formData.append('team_file', file);

    dispatch({ type: teamConstants.IMPORT_TEAM_START });
    await agent.post(`/class/${classId}/team-import`, formData, config);
    dispatch({ type: teamConstants.IMPORT_TEAM_SUCCESS });
    onSuccess();
  } catch (error) {
    dispatch({
      type: teamConstants.IMPORT_TEAM_FAIL,
      error,
    });
    onError();
  }
};

// download team file template
export const downloadTeamFile = (token) => async (dispatch) => {
  try {
    const config1 = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: teamConstants.DOWNLOAD_TEAM_FILE_START });
    const res = await agent.get('/team/template', config1);

    const config2 = {
      headers: {
        'auth-token': token,
      },
      params: {
        filename: res.data.data.filename,
        as_attachment: true,
      },
    };
    const res2 = await agent.get(`/s3-file/${res.data.data.s3_file_uuid}/url`, config2);

    fetch(res2.data.data.url).then((t) => t.blob().then((b) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.setAttribute('download', res.data.data.filename);
      a.click();
    }));
    dispatch({
      type: teamConstants.DOWNLOAD_TEAM_FILE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: teamConstants.DOWNLOAD_TEAM_FILE_FAIL,
      error,
    });
  }
};

export const editTeam = (token, teamId, teamName, classId, newLabel) => (dispatch) => {
  const config = { headers: { 'auth-token': token } };
  dispatch({ type: teamConstants.EDIT_TEAM_START });
  agent
    .patch(
      `/team/${teamId}`,
      {
        name: teamName,
        class_id: classId,
        label: newLabel,
      },
      config,
    )
    .then(() => {
      dispatch({
        type: teamConstants.EDIT_TEAM_SUCCESS,
      });
    })
    .catch((error) => {
      dispatch({
        type: teamConstants.EDIT_TEAM_FAIL,
        error,
      });
    });
};

export const fetchTeamMembers = (token, teamId) => async (dispatch) => {
  try {
    const config1 = {
      headers: { 'auth-token': token },
    };
    dispatch({ type: teamConstants.FETCH_TEAM_MEMBERS_START });
    const res1 = await agent.get(`/team/${teamId}/member`, config1);
    const { data } = res1.data;

    // Batch browse account
    const accountIds = data.map((item) => item.member_id);
    const config2 = {
      headers: { 'auth-token': token },
      params: { account_ids: JSON.stringify(accountIds) },
    };
    const res2 = await agent.get('/account-summary/batch', config2);

    dispatch({
      type: teamConstants.FETCH_TEAM_MEMBERS_SUCCESS,
      payload: { teamId, data, accounts: res2.data.data },
    });
  } catch (error) {
    dispatch({
      type: teamConstants.FETCH_TEAM_MEMBERS_FAIL,
      error,
    });
  }
};

// export const addTeamMember = (token, teamId, student, role, onSuccess, onError) => async (dispatch) => {
//   const config = {
//     headers: {
//       'auth-token': token,
//     },
//   };
//   const body = [{ account_referral: student, role }];
//   try {
//     dispatch({ type: teamConstants.ADD_TEAM_MEMBER_START });
//     await agent.post(`/team/${teamId}/member`, body, config);
//     dispatch({ type: teamConstants.ADD_TEAM_MEMBER_SUCCESS });
//     onSuccess(role);
//   } catch (error) {
//     dispatch({
//       type: teamConstants.ADD_TEAM_MEMBER_FAIL,
//       error,
//     });
//     onError();
//   }
// };

export const addTeamMember = (token, teamId, members, onSuccess, onError) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  const body = members;
  try {
    dispatch({ type: teamConstants.ADD_TEAM_MEMBER_START });
    await agent.post(`/team/${teamId}/member`, body, config);
    dispatch({ type: teamConstants.ADD_TEAM_MEMBER_SUCCESS });
    onSuccess();
  } catch (error) {
    dispatch({
      type: teamConstants.ADD_TEAM_MEMBER_FAIL,
      error,
    });
    onError();
  }
};

export const editTeamMember = (token, teamId, memberId, role) => (dispatch) => {
  const config = { headers: { 'auth-token': token } };
  dispatch({ type: teamConstants.EDIT_TEAM_MEMBER_START });
  const body = [
    {
      member_id: memberId,
      role,
    },
  ];
  agent
    .patch(`/team/${teamId}/member`, body, config)
    .then(() => {
      dispatch({
        type: teamConstants.EDIT_TEAM_MEMBER_SUCCESS,
      });
    })
    .catch((error) => {
      dispatch({
        type: teamConstants.EDIT_TEAM_MEMBER_FAIL,
        error,
      });
    });
};

export const deleteTeamMember = (token, teamId, memberId) => async (dispatch) => {
  try {
    const config = { headers: { 'auth-token': token } };
    dispatch({ type: teamConstants.DELETE_TEAM_MEMBER_START });
    await agent.delete(`/team/${teamId}/member/${memberId}`, config);
    dispatch({ type: teamConstants.DELETE_TEAM_MEMBER_SUCCESS });
  } catch (error) {
    dispatch({
      type: teamConstants.DELETE_TEAM_MEMBER_FAIL,
      error,
    });
  }
};

export const deleteTeam = (token, teamId, onSuccess, onError) => async (dispatch) => {
  try {
    const config = { headers: { 'auth-token': token } };
    dispatch({ type: teamConstants.DELETE_TEAM_START });
    await agent.delete(`/team/${teamId}`, config);
    dispatch({ type: teamConstants.DELETE_TEAM_SUCCESS });
    onSuccess();
  } catch (error) {
    dispatch({
      type: teamConstants.DELETE_TEAM_FAIL,
      error,
    });
    onError(error);
  }
};

export const createTeamWithMember = (token, classId, name, label, members, onSuccess, onTeamErr, onMemberErr) => async (dispatch) => {
  const config1 = { headers: { 'auth-token': token } };
  const config2 = { headers: { 'auth-token': token } };
  const body = Object.values(members).map((member) => ({
    account_referral: member.name,
    role: member.role === 'Normal' ? 'NORMAL' : 'MANAGER',
  }));

  try {
    dispatch({ type: teamConstants.ADD_TEAM_START });
    const res = await agent.post(`/class/${classId}/team`, { name, label }, config1);
    const teamId = res.data.data.id;
    dispatch({ type: teamConstants.ADD_TEAM_SUCCESS });

    try {
      dispatch({ type: teamConstants.ADD_TEAM_MEMBER_START });
      await agent.post(`/team/${teamId}/member`, body, config2);
      dispatch({ type: teamConstants.ADD_TEAM_MEMBER_SUCCESS });
    } catch (error) {
      onMemberErr();
      dispatch({
        type: teamConstants.ADD_TEAM_MEMBER_FAIL,
        error,
      });
    }
  } catch (error) {
    onTeamErr();
    dispatch({
      type: teamConstants.ADD_TEAM_FAIL,
      error,
    });
  }
  onSuccess();
};
