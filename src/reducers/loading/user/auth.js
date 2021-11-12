import { authConstants } from '../../../actions/user/constants';

const initialState = {
  login: false,
  logout: false,
  forgetUsername: false,
  forgetPassword: false,
  signup: false,
  fetchAccount: false,
  resetPassword: false,
  emailVerification: false,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case authConstants.AUTH_LOGIN_FAIL:
      return {
        ...state,
        login: false,
      };
    case authConstants.AUTH_START:
      return {
        ...state,
        fetchAccount: true,
      };
    case authConstants.AUTH_SUCCESS:
      return {
        ...state,
        fetchAccount: false,
      };
    case authConstants.AUTH_FAIL:
      return {
        ...state,
        fetchAccount: false,
      };
    case authConstants.FORGET_USERNAME_START:
      return {
        ...state,
        forgetPassword: true,
      };
    case authConstants.FORGET_USERNAME_SUCCESS:
      return {
        ...state,
        forgetPassword: false,
      };
    case authConstants.FORGET_USERNAME_FAIL:
      return {
        ...state,
        forgetPassword: false,
      };
    case authConstants.FORGET_PASSWORD_START:
      return {
        ...state,
        forgetPassword: true,
      };
    case authConstants.FORGET_PASSWORD_SUCCESS:
      return {
        ...state,
        forgetPassword: false,
      };
    case authConstants.FORGET_PASSWORD_FAIL:
      return {
        ...state,
        forgetPassword: false,
      };
    case authConstants.SIGNUP_START:
      return {
        ...state,
        signup: true,
      };

    case authConstants.SIGNUP_SUCCESS:
      return {
        ...state,
        signup: false,
      };
    case authConstants.SIGNUP_FAIL:
      return {
        ...state,
        signup: false,
      };
    case authConstants.RESET_PASSWORD_START:
      return {
        ...state,
        resetPassword: true,
      };
    case authConstants.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPassword: false,
      };
    case authConstants.RESET_PASSWORD_FAIL:
      return {
        ...state,
        resetPassword: false,
      };
    case authConstants.EMAIL_VERIFICATION_START:
      return {
        ...state,
        emailVerification: true,
      };
    case authConstants.EMAIL_VERIFICATION_SUCCESS:
      return {
        ...state,
        emailVerification: false,
      };
    case authConstants.EMAIL_VERIFICATION_FAIL:
      return {
        ...state,
        emailVerification: false,
      };
    default: {
      return state;
    }
  }
}
