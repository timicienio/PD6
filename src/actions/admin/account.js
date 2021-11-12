import agent from '../agent';
import { accountConstants } from './constant';

const getInstitute = (token, instituteId) => (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: accountConstants.FETCH_INSTITUTE_START });

  agent
    .get(`/institute/${instituteId}`, config)
    .then((res) => {
      dispatch({
        type: accountConstants.FETCH_INSTITUTE_SUCCESS,
        payload: res.data.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: accountConstants.FETCH_INSTITUTE_FAIL,
        error,
      });
    });
};

const addInstitute = (token, abbreviatedName, fullName, emailDomain, isDisabled, onSuccess, onError) => (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: accountConstants.ADD_INSTITUTE_START });

  agent
    .post(
      '/institute',
      {
        abbreviated_name: abbreviatedName,
        full_name: fullName,
        email_domain: emailDomain,
        is_disabled: isDisabled,
      },
      config,
    )
    .then((res) => {
      dispatch({
        type: accountConstants.ADD_INSTITUTE_SUCCESS,
        payload: {
          id: res.data.data.id,
          abbreviated_name: abbreviatedName,
          full_name: fullName,
          email_domain: emailDomain,
          is_disabled: isDisabled,
        },
      });
      onSuccess();
    })
    .catch((error) => {
      dispatch({
        type: accountConstants.ADD_INSTITUTE_FAIL,
        error,
      });
      onError();
    });
};

const editInstitute = (token, id, abbreviatedName, fullName, emailDomain, isDisabled) => (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: accountConstants.EDIT_INSTITUTE_START });
  const body = {
    abbreviated_name: abbreviatedName,
    full_name: fullName,
    email_domain: emailDomain,
    is_disabled: isDisabled,
  };

  agent
    .patch(`/institute/${id}`, body, config)
    .then(() => {
      dispatch({
        type: accountConstants.EDIT_INSTITUTE_SUCCESS,
        payload: {
          id: parseInt(id, 10),
          abbreviated_name: abbreviatedName,
          full_name: fullName,
          email_domain: emailDomain,
          is_disabled: isDisabled,
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: accountConstants.EDIT_INSTITUTE_FAIL,
        error,
      });
    });
};

// SM: edit any account
const editAccount = (token, id, realName, nickName, email) => async (dispatch) => {
  try {
    const config = {
      headers: { 'auth-token': token },
    };
    dispatch({ type: accountConstants.EDIT_ACCOUNT_START });

    const accountInfo = { real_name: realName, nickname: nickName };
    if (email) {
      accountInfo.alternative_email = email;
    }

    await agent.patch(`/account/${id}`, accountInfo, config);
    dispatch({ type: accountConstants.EDIT_ACCOUNT_SUCCESS });
  } catch (error) {
    dispatch({
      type: accountConstants.EDIT_ACCOUNT_FAIL,
      error,
    });
  }
};

// SM: delete any account
const deleteAccount = (token, id) => (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: accountConstants.DELETE_ACCOUNT_START });
  agent
    .delete(`/account/${id}`, config)
    .then(() => {
      dispatch({
        type: accountConstants.DELETE_ACCOUNT_SUCCESS,
        payload: { id },
      });
    })
    .catch((error) => {
      dispatch({
        type: accountConstants.DELETE_ACCOUNT_FAIL,
        error,
      });
    });
};

// SM: edit any account
const makeStudentCardDefault = (token, id, cardId) => (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: accountConstants.MAKE_STUDENT_CARD_DEFAULT_START });
  agent
    .put(`/account/${id}/default-student-card`, { student_card_id: cardId }, config)
    .then(() => {
      dispatch({
        type: accountConstants.MAKE_STUDENT_CARD_DEFAULT_SUCCESS,
        payload: { cardId, id },
      });
    })
    .catch((error) => {
      dispatch({
        type: accountConstants.MAKE_STUDENT_CARD_DEFAULT_FAIL,
        error,
      });
    });
};

// SM: edit any account
const fetchStudentCards = (token, id) => (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: accountConstants.FETCH_STUDENT_CARDS_START });

  agent
    .get(`/account/${id}/student-card`, config)
    .then((res) => {
      dispatch({
        type: accountConstants.FETCH_STUDENT_CARDS_SUCCESS,
        payload: { id, data: res.data.data },
      });
    })
    .catch((error) => {
      dispatch({
        type: accountConstants.FETCH_STUDENT_CARDS_FAIL,
        payload: id,
        error,
      });
    });
};

// SM: edit any account
const addStudentCard = (token, id, instituteId, emailPrefix, studentId, onSuccess, onError) => (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: accountConstants.ADD_STUDENT_CARD_START });
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
      dispatch({ type: accountConstants.ADD_STUDENT_CARD_SUCCESS });
      onSuccess();
    })
    .catch((error) => {
      dispatch({
        type: accountConstants.ADD_STUDENT_CARD_FAIL,
        error,
      });
      onError();
    });
};

// SM: edit any account
const editPassword = (token, id, newPassword) => (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: accountConstants.EDIT_PASSWORD_START });
  agent
    .put(
      `/account/${id}/pass_hash`,
      {
        new_password: newPassword,
      },
      config,
    )
    .then(() => {
      dispatch({ type: accountConstants.EDIT_PASSWORD_SUCCESS });
    })
    .catch((error) => {
      dispatch({
        type: accountConstants.EDIT_PASSWORD_FAIL,
        error,
      });
    });
};

const browsePendingStudentCards = (token, accountId) => async (dispatch) => {
  dispatch({ type: accountConstants.BROWSE_PENDING_STUDENT_CARDS_START });
  try {
    const config = {
      headers: {
        'Auth-Token': token,
      },
    };
    const res = await agent.get(`/account/${accountId}/email-verification`, config);
    dispatch({
      type: accountConstants.BROWSE_PENDING_STUDENT_CARDS_SUCCESS,
      payload: { accountId, data: res.data.data },
    });
  } catch (error) {
    dispatch({
      type: accountConstants.BROWSE_PENDING_STUDENT_CARDS_FAIL,
      error,
    });
  }
};

const resendEmailVerification = (token, emailVerificationId) => async (dispatch) => {
  dispatch({ type: accountConstants.RESEND_EMAIL_VERIFICATION_START });
  try {
    const config = {
      headers: {
        'Auth-Token': token,
      },
    };
    await agent.post(`/email-verification/${emailVerificationId}/resend`, {}, config);
    dispatch({
      type: accountConstants.RESEND_EMAIL_VERIFICATION_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: accountConstants.RESEND_EMAIL_VERIFICATION_FAIL,
      error,
    });
  }
};

const deletePendingStudentCard = (token, emailVerificationId) => async (dispatch) => {
  dispatch({ type: accountConstants.DELETE_PENDING_STUDENT_CARD_START });
  try {
    const config = {
      headers: {
        'Auth-Token': token,
      },
    };
    await agent.delete(`/email-verification/${emailVerificationId}`, config);
    dispatch({
      type: accountConstants.DELETE_PENDING_STUDENT_CARD_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: accountConstants.DELETE_PENDING_STUDENT_CARD_FAIL,
      error,
    });
  }
};

const addAccount = (token, realName, userName, password, altMail, onSuccess, onError) => async (dispatch) => {
  try {
    const config = { headers: { 'auth-token': token } };
    dispatch({ type: accountConstants.ADD_ACCOUNT_START });
    await agent.post(
      '/account-normal',
      {
        real_name: realName,
        username: userName,
        password,
        alternative_email: altMail,
        nickname: '',
      },
      config,
    );
    dispatch({ type: accountConstants.ADD_ACCOUNT_SUCCESS });
    onSuccess();
  } catch (error) {
    dispatch({
      type: accountConstants.ADD_ACCOUNT_FAIL,
      error,
    });
    onError();
  }
};

const importAccount = (token, files, onSuccess, onError) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
        'Content-Type': 'multipart/form-data',
      },
    };

    dispatch({ type: accountConstants.IMPORT_ACCOUNT_START });
    await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append('account_file', file);
        await agent.post('/account-import', formData, config);
      }),
    );
    dispatch({ type: accountConstants.IMPORT_ACCOUNT_SUCCESS });
    onSuccess();
  } catch (error) {
    dispatch({
      type: accountConstants.IMPORT_ACCOUNT_FAIL,
      error,
    });
    onError();
  }
};

const downloadAccountFile = (token) => async (dispatch) => {
  try {
    const config1 = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: accountConstants.DOWNLOAD_ACCOUNT_FILE_START });
    const res = await agent.get('/account/template', config1);

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
      type: accountConstants.DOWNLOAD_ACCOUNT_FILE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: accountConstants.DOWNLOAD_ACCOUNT_FILE_FAIL,
      error,
    });
  }
};

export {
  getInstitute,
  addInstitute,
  editInstitute,
  editAccount,
  deleteAccount,
  makeStudentCardDefault,
  fetchStudentCards,
  addStudentCard,
  editPassword,
  browsePendingStudentCards,
  resendEmailVerification,
  deletePendingStudentCard,
  addAccount,
  importAccount,
  downloadAccountFile,
};
