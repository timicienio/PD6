import agent from '../agent';
import { commonConstants } from './constant';
import { autoTableConstants } from '../component/constant';
import browseParamsTransForm from '../../function/browseParamsTransform';

const getInstitutes = () => (dispatch) => {
  dispatch({ type: commonConstants.GET_INSTITUTE_START });

  agent
    .get('/institute')
    .then((res) => {
      dispatch({
        type: commonConstants.GET_INSTITUTE_SUCCESS,
        payload: res.data.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: commonConstants.GET_INSTITUTE_FAIL,
        error,
      });
    });
};

// WITH BROWSE API
const fetchClassMembers = (token, classId, browseParams, tableId = null) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
      params: browseParamsTransForm(browseParams),
    };
    dispatch({ type: commonConstants.FETCH_CLASS_MEMBERS_START });
    const res = await agent.get(`/class/${classId}/member`, config);
    const { data, total_count } = res.data.data;

    dispatch({
      type: commonConstants.FETCH_CLASS_MEMBERS_SUCCESS,
      payload: {
        classId,
        data,
      },
    });
    dispatch({
      type: autoTableConstants.AUTO_TABLE_UPDATE,
      payload: {
        tableId,
        totalCount: total_count,
        dataIds: data.map((item) => item.member_id),
        offset: browseParams.offset,
      },
    });
  } catch (error) {
    dispatch({
      type: commonConstants.FETCH_CLASS_MEMBERS_FAIL,
      error,
    });
  }
};

// Used ONLY in class member edit
const fetchClassMemberWithAccountReferral = (token, classId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: commonConstants.FETCH_CLASS_MEMBER_WITH_ACCOUNT_REFERRAL_START });
    const res = await agent.get(`/class/${classId}/member/account-referral`, config);
    const { data } = res.data;
    dispatch({
      type: commonConstants.FETCH_CLASS_MEMBER_WITH_ACCOUNT_REFERRAL_SUCCESS,
      payload: {
        classId,
        data: {
          classMembers: data.map(({ member_id, member_role }) => ({
            id: `${classId}-${member_id}`,
            account_id: member_id,
            class_id: classId,
            role: member_role,
          })),
          accounts: data.map(({ member_id, member_referral }) => ({
            id: member_id,
            referral: member_referral,
          })),
        },
      },
    });
  } catch (error) {
    dispatch({
      type: commonConstants.FETCH_CLASS_MEMBER_WITH_ACCOUNT_REFERRAL_FAIL,
      error,
    });
  }
};

const replaceClassMembers = (token, classId, replacingList, onSuccess, onError) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: commonConstants.REPLACE_CLASS_MEMBERS_START });

    const res = await agent.put(`/class/${classId}/member`, replacingList, config);
    dispatch({
      type: commonConstants.REPLACE_CLASS_MEMBERS_SUCCESS,
    });

    const handleResponse = (responseList) => {
      const failedList = responseList
        .reduce((acc, cur, index) => (cur === false ? acc.concat(index) : acc), [])
        .map((index) => replacingList[index].account_referral);

      if (failedList.length === 0) {
        onSuccess();
      } else {
        onError(failedList);
      }
    };
    handleResponse(res.data.data);
  } catch (error) {
    dispatch({
      type: commonConstants.REPLACE_CLASS_MEMBERS_FAIL,
      error,
    });
    onError();
  }
};

const browseSubmitLang = (token) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: commonConstants.BROWSE_SUBMISSION_LANG_START });
    const res = await agent.get('/submission/language', config);
    dispatch({
      type: commonConstants.BROWSE_SUBMISSION_LANG_SUCCESS,
      payload: res.data.data,
    });
  } catch (error) {
    dispatch({
      type: commonConstants.BROWSE_SUBMISSION_LANG_FAIL,
      error,
    });
  }
};

const fetchCourse = (token, courseId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: commonConstants.FETCH_COURSE_START });
    const res = await agent.get(`/course/${courseId}`, config);
    dispatch({ type: commonConstants.FETCH_COURSE_SUCCESS, payload: res.data.data });
  } catch (error) {
    dispatch({
      type: commonConstants.FETCH_COURSE_FAIL,
      error,
    });
  }
};

const fetchClass = (token, classId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: commonConstants.FETCH_CLASS_START });
    const res = await agent.get(`/class/${classId}`, config);
    dispatch({ type: commonConstants.FETCH_CLASS_SUCCESS, payload: res.data.data });
  } catch (error) {
    dispatch({
      type: commonConstants.FETCH_CLASS_FAIL,
      error,
    });
  }
};

const fetchChallenge = (token, challengeId) => async (dispatch) => {
  dispatch({ type: commonConstants.READ_CHALLENGE_START });
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  try {
    const challenge = await agent.get(`/challenge/${challengeId}`, config);

    dispatch({
      type: commonConstants.READ_CHALLENGE_SUCCESS,
      payload: challenge.data.data,
    });
  } catch (error) {
    dispatch({
      type: commonConstants.READ_CHALLENGE_FAIL,
      error,
    });
  }
};

const fetchAccount = (token, accountId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: commonConstants.FETCH_ACCOUNT_START });
    const res = await agent.get(`/account/${accountId}`, config);
    dispatch({ type: commonConstants.FETCH_ACCOUNT_SUCCESS, payload: res.data.data });
  } catch (error) {
    dispatch({
      type: commonConstants.FETCH_ACCOUNT_FAIL,
      error,
    });
  }
};

// get file URL and download
const downloadFile = (token, file) => async (dispatch) => {
  // in 'file' parameter, you should include uuid, filename, and as_attachment as attributes
  const config = {
    headers: {
      'auth-token': token,
    },
    params: {
      filename: file.filename,
      as_attachment: file.as_attachment,
    },
  };
  try {
    dispatch({ type: commonConstants.DOWNLOAD_FILE_START });
    const res = await agent.get(`/s3-file/${file.uuid}/url`, config);

    fetch(res.data.data.url).then((t) => t.blob().then((b) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.setAttribute('download', file.filename);
      a.click();
    }));

    dispatch({
      type: commonConstants.DOWNLOAD_FILE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: commonConstants.DOWNLOAD_FILE_FAIL,
      error,
    });
  }
};

// get file URL only
const fetchDownloadFileUrl = (token, file) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
    params: {
      filename: file.filename,
      as_attachment: file.as_attachment,
    },
  };
  try {
    dispatch({ type: commonConstants.FETCH_DOWNLOAD_FILE_URL_START });
    const res = await agent.get(`/s3-file/${file.uuid}/url`, config);
    dispatch({
      type: commonConstants.FETCH_DOWNLOAD_FILE_URL_SUCCESS,
      payload: { uuid: file.uuid, url: res.data.data.url },
    });
  } catch (error) {
    dispatch({
      type: commonConstants.FETCH_DOWNLOAD_FILE_URL_FAIL,
      error,
    });
  }
};

// fetch all challenges and coding problems (no essay/peer review) under class
const fetchAllChallengesProblems = (token, classId) => async (dispatch) => {
  dispatch({ type: commonConstants.FETCH_ALL_CHALLENGES_PROBLEMS_START });
  const config = {
    headers: {
      'auth-token': token,
    },
  };

  try {
    const res = await agent.get(`/class/${classId}/challenge`, config);
    const problems = await Promise.all(
      res.data.data.data.map(async ({ id }) => agent
        .get(`/challenge/${id}/task`, config)
        .then((res2) => res2.data.data.problem)
        .catch((error) => {
          dispatch({
            type: commonConstants.FETCH_ALL_CHALLENGES_PROBLEMS_FAIL,
            error,
          });
        })),
    );
    const newProblems = problems.flat();
    dispatch({
      type: commonConstants.FETCH_ALL_CHALLENGES_PROBLEMS_SUCCESS,
      payload: { classId, challenges: res.data.data.data, problems: newProblems },
    });
  } catch (error) {
    dispatch({
      type: commonConstants.FETCH_ALL_CHALLENGES_PROBLEMS_FAIL,
      error,
    });
  }
};

const fetchProblems = (token, classId, browseParams, tableId = null) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
    params: browseParamsTransForm(browseParams),
  };

  try {
    dispatch({ type: commonConstants.FETCH_PROBLEMS_START });
    const res = await agent.get(`/class/${classId}/view/problem-set`, config);
    const { data, total_count } = res.data.data;
    dispatch({
      type: commonConstants.FETCH_PROBLEMS_SUCCESS,
      payload: data,
    });
    dispatch({
      type: autoTableConstants.AUTO_TABLE_UPDATE,
      payload: {
        tableId,
        totalCount: total_count,
        dataIds: data.map((item) => item.problem_id),
        offset: browseParams.offset,
      },
    });
  } catch (error) {
    dispatch({
      type: commonConstants.FETCH_PROBLEMS_FAIL,
      error,
    });
  }
};

const getAccountBatch = (token, accountId) => async (dispatch) => {
  dispatch({ type: commonConstants.GET_ACCOUNT_BATCH_START });
  const config = {
    headers: { 'auth-token': token },
    params: { account_ids: JSON.stringify([accountId]) },
  };
  try {
    const res = await agent.get('/account-summary/batch', config);

    dispatch({
      type: commonConstants.GET_ACCOUNT_BATCH_SUCCESS,
      payload: { data: res.data.data[0], accountId },
    });
  } catch (error) {
    dispatch({
      type: commonConstants.GET_ACCOUNT_BATCH_FAIL,
      error,
    });
  }
};

const getAccountBatchByReferral = (token, account_referrals, teamId, role, onSuccess, onError) => async (dispatch) => {
  try {
    const config = {
      headers: { 'auth-token': token },
      params: { account_referrals: JSON.stringify([account_referrals]) },
    };
    dispatch({ type: commonConstants.GET_ACCOUNT_BATCH_BY_REFERRAL_START });
    const res = await agent.get('/account-summary/batch-by-account-referral', config);

    if (res.data.data.length !== 0) {
      const memberId = res.data.data[0].id;
      dispatch({
        type: commonConstants.GET_ACCOUNT_BATCH_BY_REFERRAL_SUCCESS,
        payload: { teamId, memberId },
      });
      onSuccess(res.data.data[0], role);
    } else {
      dispatch({
        type: commonConstants.GET_ACCOUNT_BATCH_BY_REFERRAL_FAIL,
        error: 'Member does not exist.',
      });
      onError();
    }
  } catch (error) {
    dispatch({
      type: commonConstants.GET_ACCOUNT_BATCH_BY_REFERRAL_FAIL,
      error,
    });
    onError();
  }
};

export {
  getInstitutes,
  fetchClassMembers,
  fetchClassMemberWithAccountReferral,
  replaceClassMembers,
  fetchCourse,
  fetchClass,
  fetchChallenge,
  fetchAccount,
  browseSubmitLang,
  downloadFile,
  fetchDownloadFileUrl,
  fetchAllChallengesProblems,
  fetchProblems,
  getAccountBatch,
  getAccountBatchByReferral,
};
