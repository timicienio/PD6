import moment from 'moment';

import agent from '../agent';
import { challengeConstants } from './constant';
import { autoTableConstants } from '../component/constant';
import browseParamsTransForm from '../../function/browseParamsTransform';

const browseTasksUnderChallenge = (token, challengeId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_START });
    const res = await agent.get(`/challenge/${challengeId}/task`, config);
    dispatch({
      type: challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_SUCCESS,
      payload: { id: challengeId, data: res.data.data },
    });
  } catch (error) {
    dispatch({
      type: challengeConstants.BROWSE_TASKS_UNDER_CHALLENGE_FAIL,
      error,
    });
  }
};

const fetchChallenges = (token, classId, browseParams, tableId = null) => async (dispatch) => {
  try {
    // transform status to time comparison
    const adjustedBrowseParams = {
      ...browseParams,
      filter: browseParams.filter.reduce((acc, item) => {
        if (item[0] === 'status') {
          const currentTime = moment().toISOString();

          if (item[2][0] === 'Not Yet') {
            return [...acc, ['start_time', '>', currentTime]];
          }
          if (item[2][0] === 'Closed') {
            return [...acc, ['end_time', '<', currentTime]];
          }
          if (item[2][0] === 'Opened') {
            return [...acc, ['start_time', '<', currentTime], ['end_time', '>', currentTime]];
          }
        }
        return [...acc, item];
      }, []),
    };

    const config = {
      headers: {
        'auth-token': token,
      },
      params: browseParamsTransForm(adjustedBrowseParams),
    };
    dispatch({ type: challengeConstants.FETCH_CHALLENGES_START });
    const res = await agent.get(`/class/${classId}/challenge`, config);
    const { data: challenges, total_count } = res.data.data;
    dispatch({
      type: challengeConstants.FETCH_CHALLENGES_SUCCESS,
      payload: { classId, data: challenges },
    });

    dispatch({
      type: autoTableConstants.AUTO_TABLE_UPDATE,
      payload: {
        tableId,
        totalCount: total_count,
        dataIds: challenges.map((item) => item.id),
        offset: browseParams.offset,
      },
    });
  } catch (error) {
    dispatch({
      type: challengeConstants.FETCH_CHALLENGES_FAIL,
      error,
    });
  }
};

const peerReviewFetchChallenges = (token, classId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: challengeConstants.FETCH_CHALLENGES_START });
    const res = await agent.get(`/class/${classId}/challenge`, config);
    const { data: challenges } = res.data.data;
    dispatch({
      type: challengeConstants.FETCH_CHALLENGES_SUCCESS,
      payload: { classId, data: challenges },
    });
  } catch (error) {
    dispatch({
      type: challengeConstants.FETCH_CHALLENGES_FAIL,
      error,
    });
  }
};

// add a challenge under class
const addChallenge = (token, classId, body) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: challengeConstants.ADD_CHALLENGE_START });
    await agent.post(
      `/class/${classId}/challenge`,
      {
        publicize_type: body.showTime,
        selection_type: body.scoredBy,
        title: body.title,
        description: '',
        start_time: body.startTime,
        end_time: body.endTime,
      },
      config,
    );
    dispatch({ type: challengeConstants.ADD_CHALLENGE_SUCCESS });
  } catch (error) {
    dispatch({
      type: challengeConstants.ADD_CHALLENGE_FAIL,
      error,
    });
  }
};

// in ChallengeInfo: edit description
// in SettingEdit: edit everything else
const editChallenge = (token, challengeId, body) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: challengeConstants.EDIT_CHALLENGE_START });
    await agent.patch(`/challenge/${challengeId}`, body, config);
    dispatch({ type: challengeConstants.EDIT_CHALLENGE_SUCCESS });
  } catch (error) {
    dispatch({
      type: challengeConstants.EDIT_CHALLENGE_FAIL,
      error,
    });
  }
};

const deleteChallenge = (token, challengeId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: challengeConstants.DELETE_CHALLENGE_START });
    await agent.delete(`/challenge/${challengeId}`, config);
    dispatch({ type: challengeConstants.DELETE_CHALLENGE_SUCCESS });
  } catch (error) {
    dispatch({
      type: challengeConstants.DELETE_CHALLENGE_FAIL,
      error,
    });
  }
};

// fetch statistics summary
const fetchChallengeSummary = (token, challengeId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: challengeConstants.FETCH_CHALLENGE_SUMMARY_START });
    const res = await agent.get(`/challenge/${challengeId}/statistics/summary`, config);
    dispatch({
      type: challengeConstants.FETCH_CHALLENGE_SUMMARY_SUCCESS,
      payload: { challengeId, data: res.data.data.tasks },
    });
  } catch (error) {
    dispatch({
      type: challengeConstants.FETCH_CHALLENGE_SUMMARY_FAIL,
      error,
    });
  }
};

// fetch statistics scoreboard data
const fetchChallengeMemberSubmission = (token, challengeId) => async (dispatch) => {
  try {
    const config = {
      headers: { 'auth-token': token },
    };

    dispatch({ type: challengeConstants.FETCH_CHALLENGE_MEMBER_SUBMISSION_START });
    const res1 = await agent.get(`/challenge/${challengeId}/statistics/member-submission`, config);
    const memberSubmission = res1.data.data.data.member;

    // Batch browse account
    const accountIds = memberSubmission.map((item) => Number(item.id));
    const config2 = {
      headers: { 'auth-token': token },
      params: { account_ids: JSON.stringify(accountIds) },
    };

    const res2 = await agent.get('/account-summary/batch', config2);
    const { data: accounts } = res2.data;

    dispatch({
      type: challengeConstants.FETCH_CHALLENGE_MEMBER_SUBMISSION_SUCCESS,
      payload: { challengeId, data: memberSubmission, accounts: accounts.filter((item) => item !== null) },
    });
  } catch (error) {
    dispatch({
      type: challengeConstants.FETCH_CHALLENGE_MEMBER_SUBMISSION_FAIL,
      error,
    });
  }
};

const addProblem = (token, challengeId, label, title, history, courseId, classId, onError) => async (dispatch) => {
  dispatch({ type: challengeConstants.ADD_PROBLEM_START });
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  const body = {
    challenge_label: label,
    title,
    full_score: 0,
    description: '',
    io_description: '',
    source: '',
    hint: '',
  };
  try {
    const res = await agent.post(`/challenge/${challengeId}/problem`, body, config);
    const { data } = res.data;
    const { id } = data;
    dispatch({
      type: challengeConstants.ADD_PROBLEM_SUCCESS,
    });
    history.push(`/my-class/${courseId}/${classId}/challenge/${challengeId}/${id}`);
  } catch (error) {
    dispatch({
      type: challengeConstants.ADD_PROBLEM_FAIL,
      error,
    });
    onError();
  }
};

const addEssay = (token, challengeId, label, title, history, courseId, classId, onError) => async (dispatch) => {
  dispatch({ type: challengeConstants.ADD_ESSAY_START });
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  const body = {
    challenge_label: label,
    title,
    description: '',
  };
  try {
    const res = await agent.post(`/challenge/${challengeId}/essay`, body, config);
    const { data } = res.data;
    const { id } = data;
    dispatch({
      type: challengeConstants.ADD_ESSAY_SUCCESS,
    });
    history.push(`/my-class/${courseId}/${classId}/challenge/${challengeId}/essay/${id}`);
  } catch (error) {
    dispatch({
      type: challengeConstants.ADD_ESSAY_FAIL,
      error,
    });
    onError();
  }
};

const addPeerReview = (
  token,
  challengeId,
  label,
  title,
  problemId,
  minScore,
  maxScore,
  maxReviewCount,
  history,
  courseId,
  classId,
  onError,
) => async (dispatch) => {
  dispatch({ type: challengeConstants.ADD_PEER_REVIEW_START });
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  const body = {
    challenge_label: label,
    title,
    target_problem_id: problemId,
    description: '',
    min_score: minScore,
    max_score: maxScore,
    max_review_count: maxReviewCount,
  };
  try {
    const res = await agent.post(`/challenge/${challengeId}/peer-review`, body, config);
    const { data } = res.data;
    const { id } = data;
    dispatch({
      type: challengeConstants.ADD_PEER_REVIEW_SUCCESS,
    });
    history.push(`/my-class/${courseId}/${classId}/challenge/${challengeId}/peer-review/${id}`);
  } catch (error) {
    dispatch({
      type: challengeConstants.ADD_PEER_REVIEW_FAIL,
      error,
    });
    onError();
  }
};

export {
  browseTasksUnderChallenge,
  fetchChallenges,
  addChallenge,
  editChallenge,
  deleteChallenge,
  fetchChallengeSummary,
  fetchChallengeMemberSubmission,
  addProblem,
  addEssay,
  addPeerReview,
  peerReviewFetchChallenges,
};
