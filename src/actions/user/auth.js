import agent from '../agent';
import { authConstants } from './constants';

const userSignIn = (username, password) => async (dispatch) => {
  try {
    const res1 = await agent.post('/account/jwt', { username, password });
    const id = res1.data.data.account_id;
    const { token } = res1.data.data;
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    const [res2, res3] = await Promise.all([
      agent.get(`/account/${id}`, config),
      agent.get(`/account/${id}/class`, config),
    ]);

    dispatch({
      type: authConstants.AUTH_SUCCESS,
      user: {
        token,
        ...res2.data.data,
        classes: res3.data.data,
      },
    });
  } catch (error) {
    dispatch({
      type: authConstants.AUTH_FAIL,
      error,
    });
  }
};

// resume logged in status from cookies
const getUserInfo = (id, token) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };

    const [res1, res2] = await Promise.all([
      agent.get(`/account/${id}`, config),
      agent.get(`/account/${id}/class`, config),
    ]);

    dispatch({
      type: authConstants.AUTH_SUCCESS,
      user: {
        token,
        ...res1.data.data,
        classes: res2.data.data,
      },
    });
  } catch (error) {
    dispatch({
      type: authConstants.AUTH_FAIL,
      error,
    });
  }
};

const userLogout = (history) => (dispatch) => {
  dispatch({ type: authConstants.AUTH_LOGOUT });
  history.push('/login');
};

const userForgetUsername = (email, onSuccess, onError) => async (dispatch) => {
  try {
    dispatch({ type: authConstants.FORGET_USERNAME_START });
    await agent.post('/account/forget-username', { email });
    dispatch({ type: authConstants.FORGET_USERNAME_SUCCESS });
    onSuccess();
  } catch (error) {
    dispatch({ type: authConstants.FORGET_USERNAME_FAIL, error });
    onError();
  }
};

const userForgetPassword = (username, email, onSuccess, onError) => async (dispatch) => {
  try {
    dispatch({ type: authConstants.FORGET_PASSWORD_START });
    await agent.post('/account/forget-password', { username, email });
    dispatch({ type: authConstants.FORGET_PASSWORD_SUCCESS });
    onSuccess();
  } catch (error) {
    dispatch({ type: authConstants.FORGET_PASSWORD_FAIL, error });
    onError();
  }
};

const userRegister = (username, password, nickname, realName, emailPrefix, instituteId, studentId) => async (dispatch) => {
  const body = {
    username,
    password,
    nickname,
    real_name: realName,
    alternative_email: null,
    institute_id: instituteId,
    student_id: studentId,
    institute_email_prefix: emailPrefix,
  };
  try {
    dispatch({ type: authConstants.SIGNUP_START });
    await agent.post('account', body);
    dispatch({ type: authConstants.SIGNUP_SUCCESS });
  } catch (error) {
    dispatch({
      type: authConstants.SIGNUP_FAIL,
      error,
    });
  }
};

const emailVerification = (code, onSuccess, onError) => async (dispatch) => {
  const config = {
    params: {
      code,
    },
  };

  try {
    dispatch({ type: authConstants.EMAIL_VERIFICATION_START });
    await agent.get('/email-verification', config);
    dispatch({ type: authConstants.EMAIL_VERIFICATION_SUCCESS });
    onSuccess();
  } catch (error) {
    dispatch({
      type: authConstants.EMAIL_VERIFICATION_FAIL,
      error,
    });
    onError();
  }
};

const userResetPassword = (code, password) => async (dispatch) => {
  try {
    dispatch({ type: authConstants.RESET_PASSWORD_START });
    await agent.post('account/reset-password', { code, password });
    dispatch({ type: authConstants.RESET_PASSWORD_SUCCESS });
  } catch (error) {
    dispatch({
      type: authConstants.RESET_PASSWORD_FAIL,
      error,
    });
  }
};

export {
  getUserInfo,
  userSignIn,
  userLogout,
  userForgetUsername,
  userForgetPassword,
  userRegister,
  emailVerification,
  userResetPassword,
};
