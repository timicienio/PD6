import moment from 'moment';
import agent from '../agent';
import { userConstants } from './constants';
import browseParamsTransForm from '../../function/browseParamsTransform';

const editAccount = (token, id, nickName, email) => async (dispatch) => {
  try {
    const config = {
      headers: { 'auth-token': token },
    };
    dispatch({ type: userConstants.EDIT_SELF_ACCOUNT_START });
    const accountInfo = { nickname: nickName };
    if (email) {
      accountInfo.alternative_email = email;
    }
    await agent.patch(`/account/${id}`, accountInfo, config);
    dispatch({
      type: userConstants.EDIT_SELF_ACCOUNT_SUCCESS,
      payload: {
        id,
        nickname: nickName,
        alternative_email: email,
      },
    });
  } catch (error) {
    dispatch({
      type: userConstants.EDIT_SELF_ACCOUNT_FAIL,
      error,
    });
  }
};

const makeStudentCardDefault = (token, id, cardId) => (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };

  dispatch({ type: userConstants.MAKE_SELF_STUDENT_CARD_DEFAULT_START });
  agent
    .put(`/account/${id}/default-student-card`, { student_card_id: cardId }, config)
    .then(() => {
      dispatch({
        type: userConstants.MAKE_SELF_STUDENT_CARD_DEFAULT_SUCCESS,
        payload: { cardId, id },
      });
    })
    .catch((error) => {
      dispatch({
        type: userConstants.MAKE_SELF_STUDENT_CARD_DEFAULT_FAIL,
        error,
      });
    });
};

const fetchStudentCards = (token, id) => (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };

  dispatch({ type: userConstants.GET_SELF_STUDENT_CARD_START });
  agent
    .get(`/account/${id}/student-card`, config)
    .then((res) => {
      dispatch({
        type: userConstants.GET_SELF_STUDENT_CARD_SUCCESS,
        payload: res.data.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: userConstants.GET_SELF_STUDENT_CARD_FAIL,
        error,
      });
    });
};

const addStudentCard = (token, id, instituteId, emailPrefix, studentId, onSuccess) => (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };

  dispatch({ type: userConstants.ADD_SELF_STUDENT_CARD_START });
  agent
    .post(
      `/account/${id}/student-card`,
      {
        institute_id: instituteId,
        institute_email_prefix: emailPrefix,
        student_id: studentId,
      },
      config,
    )
    .then(() => {
      dispatch({ type: userConstants.ADD_SELF_STUDENT_CARD_SUCCESS });
      onSuccess();
    })
    .catch((error) => {
      dispatch({
        type: userConstants.ADD_SELF_STUDENT_CARD_FAIL,
        error,
      });
    });
};

const editPassword = (token, id, oldPassword, newPassword, onSuccess, onError) => (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: userConstants.EDIT_SELF_PASSWORD_START });

  agent
    .put(
      `/account/${id}/pass_hash`,
      {
        old_password: oldPassword,
        new_password: newPassword,
      },
      config,
    )
    .then(() => {
      dispatch({ type: userConstants.EDIT_SELF_PASSWORD_SUCCESS });
      onSuccess();
    })
    .catch((error) => {
      dispatch({
        type: userConstants.EDIT_SELF_PASSWORD_FAIL,
        error,
      });
      onError();
    });
};

// browse all active announcement
const userBrowseAnnouncement = (authToken) => async (dispatch) => {
  const currentTime = moment().toISOString();
  const config = {
    headers: {
      'auth-token': authToken,
    },
    params: browseParamsTransForm(
      {
        filter: [['expire_time', '>', currentTime]],
      },
    ),
  };

  try {
    const notifyRes = await agent.get('/announcement', config);
    dispatch({
      type: userConstants.USER_BROWSE_ANNOUNCEMENT_SUCCESS,
      payload: notifyRes.data.data.data,
    });
  } catch (error) {
    dispatch({
      type: userConstants.USER_BROWSE_ANNOUNCEMENT_FAIL,
      error,
    });
  }
};

// const userReadAnnouncement = (authToken, notifyId) => async (dispatch) => {
//   const config = {
//     headers: {
//       'auth-token': authToken,
//     },
//   };

//   try {
//     const notifyReadRes = await agent.get(`/announcement/${notifyId}`, config);
//     const notifyRes = await agent.get('/announcement', config);
//     dispatch({
//       type: userConstants.USER_BROWSE_ANNOUNCEMENT_SUCCESS,
//       payload: notifyRes.data.data.data,
//     });
//     // console.log(notifyRes.data);
//   } catch (error) {
//     dispatch({
//       type: userConstants.USER_READ_NOTIFY_FAIL,
//       error,
//     });
//   }
// };
const browsePendingStudentCards = (token, accountId) => async (dispatch) => {
  dispatch({ type: userConstants.BROWSE_SELF_PENDING_STUDENT_CARDS_START });
  try {
    const config = {
      headers: {
        'Auth-Token': token,
      },
    };
    const res = await agent.get(`/account/${accountId}/email-verification`, config);
    dispatch({
      type: userConstants.BROWSE_SELF_PENDING_STUDENT_CARDS_SUCCESS,
      payload: res.data.data,
    });
  } catch (error) {
    dispatch({
      type: userConstants.BROWSE_SELF_PENDING_STUDENT_CARDS_FAIL,
      error,
    });
  }
};

const resendEmailVerification = (token, emailVerificationId) => async (dispatch) => {
  dispatch({ type: userConstants.RESEND_SELF_EMAIL_VERIFICATION_START });
  try {
    const config = {
      headers: {
        'Auth-Token': token,
      },
    };
    await agent.post(`/email-verification/${emailVerificationId}/resend`, {}, config);
    dispatch({
      type: userConstants.RESEND_SELF_EMAIL_VERIFICATION_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: userConstants.RESEND_SELF_EMAIL_VERIFICATION_FAIL,
      error,
    });
  }
};

const deletePendingStudentCard = (token, emailVerificationId) => async (dispatch) => {
  dispatch({ type: userConstants.DELETE_SELF_PENDING_STUDENT_CARD_START });
  try {
    const config = {
      headers: {
        'Auth-Token': token,
      },
    };
    await agent.delete(`/email-verification/${emailVerificationId}`, config);
    dispatch({
      type: userConstants.DELETE_SELF_PENDING_STUDENT_CARD_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: userConstants.DELETE_SELF_PENDING_STUDENT_CARD_FAIL,
      error,
    });
  }
};

const readAccount = (token, accountId) => async (dispatch) => {
  dispatch({ type: userConstants.READ_OTHERS_ACCOUNT_START });
  try {
    const config = {
      headers: {
        'Auth-Token': token,
      },
    };
    const res = await agent.get(`/account/${accountId}`, config);
    dispatch({
      type: userConstants.READ_OTHERS_ACCOUNT_SUCCESS,
      payload: res.data.data,
    });
  } catch (error) {
    dispatch({
      type: userConstants.READ_OTHERS_ACCOUNT_FAIL,
      error,
    });
  }
};

export {
  editAccount,
  makeStudentCardDefault,
  fetchStudentCards,
  addStudentCard,
  editPassword,
  userBrowseAnnouncement,
  browsePendingStudentCards,
  resendEmailVerification,
  deletePendingStudentCard,
  // userReadAnnouncement,
  readAccount,
};
