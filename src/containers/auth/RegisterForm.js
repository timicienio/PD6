import { useState, useEffect } from 'react';
import React, { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  makeStyles,
  Snackbar,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

import { Link as RouterLink, useHistory } from 'react-router-dom';
import { userRegister } from '../../actions/user/auth';
import { getInstitutes } from '../../actions/common/common';
import GeneralLoading from '../../components/GeneralLoading';

const useStyles = makeStyles((theme) => ({
  authForm: {
    width: '70%',
  },
  authTextFields: {
    width: '100%',
    marginTop: '50px',
  },
  authTextFieldsComplex: {
    width: '100%',
    marginTop: '40px',
  },
  authButtons: {
    marginTop: '44px',
    marginBottom: '30px',
  },
  authLink: {
    color: theme.palette.grey.A400,
  },
  snackbar: {
    width: '400px',
  },
}));

function checkPassword(password1, password2) {
  if (password1 === password2) {
    return 'Same';
  }
  return "Passwords don't match";
}

export default function RegisterForm() {
  const classNames = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const loadingInstitute = useSelector((state) => state.loading.common.fetchInstitutes);
  const registerLoading = useSelector((state) => state.loading.user.auth.signup);
  const registerError = useSelector((state) => state.error.user.auth.signup);
  const institutes = useSelector((state) => state.institutes.byId);
  const institutesId = useSelector((state) => state.institutes.allIds);
  const enableInstitutesId = institutesId.filter((item) => !institutes[item].is_disabled);

  const [nextPage, setNextPage] = useState(false);

  const [inputs, setInputs] = useState({
    realName: '',
    school: 'National Taiwan University',
    username: '',
    nickname: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    realName: false,
    school: false,
    username: false,
    studentId: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [errorTexts, setErrorTexts] = useState({
    realName: '',
    school: '',
    username: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [emailTail, setEmailTail] = useState('@ntu.edu.tw');

  const [popup, setPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hasRequest, setHasRequest] = useState(false);

  const labelName = ['realName', 'school', 'username', 'studentId', 'email', 'password', 'confirmPassword'];

  useEffect(() => {
    dispatch(getInstitutes());
  }, [dispatch]);

  const transform = (school) => {
    const ids = enableInstitutesId.filter((item) => institutes[item].full_name === school);
    return ids.length === 0 ? 1 : ids[0];
  };

  const onSubmit = () => {
    const newInputs = labelName.reduce((acc, item) => ({ ...acc, [item]: inputs[item].trim() }), {});
    let hasError = labelName.reduce((acc, item) => acc || newInputs[item] === '', false);

    setErrors(
      labelName.reduce((acc, item) => {
        console.log(item, newInputs[item] === '');
        if (item !== 'password' && item !== 'confirmPassword') {
          return { ...acc, [item]: newInputs[item].trim() === '' };
        }
        return { ...acc, [item]: newInputs[item] === '' };
      }, {}),
    );
    setErrorTexts(
      labelName.reduce((acc, item) => {
        if (item !== 'password' && item !== 'confirmPassword') {
          return { ...acc, [item]: newInputs[item].trim() === '' ? "Can't be empty" : '' };
        }
        return { ...acc, [item]: newInputs[item] === '' ? "Can't be empty" : '' };
      }, {}),
    );

    // check password
    const statusP = checkPassword(newInputs.password, newInputs.confirmPassword);
    if (statusP === "Passwords don't match") {
      setErrors((input) => ({ ...input, confirmPassword: true }));
      setErrorTexts((input) => ({ ...input, confirmPassword: statusP }));
      hasError = true;
    }

    if (!hasError) {
      dispatch(
        userRegister(
          inputs.username.trim(),
          inputs.password,
          inputs.nickname.trim(),
          inputs.realName.trim(),
          inputs.email.trim(),
          transform(inputs.school),
          inputs.studentId.trim(),
        ),
      );
      setHasRequest(true);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((input) => ({ ...input, [name]: value }));
    if (value !== '' && errorTexts[name] === "Can't be empty") {
      setErrors((input) => ({ ...input, [name]: false }));
      setErrorTexts((input) => ({ ...input, [name]: '' }));
    }

    if (name === 'confirmPassword' || name === 'password') {
      if (
        checkPassword(inputs.password, value) === "Passwords don't match"
        && checkPassword(inputs.confirmPassword, value) === "Passwords don't match"
      ) {
        setErrors((input) => ({ ...input, confirmPassword: true }));
        setErrorTexts((input) => ({ ...input, confirmPassword: "Passwords don't match" }));
      } else {
        setErrors((input) => ({ ...input, confirmPassword: false }));
        setErrorTexts((input) => ({ ...input, confirmPassword: '' }));
      }
    }

    // change email tail
    if (name === 'school') {
      setEmailTail(`@${institutes[transform(value)].email_domain}`);
    }

    if (name === 'username' && errorTexts[name] === 'Username Exists') {
      setErrors((input) => ({ ...input, username: false }));
      setErrorTexts((input) => ({ ...input, username: '' }));
    }

    if (name === 'studentId') {
      if (errorTexts[name] === 'Student ID Exists') {
        setErrors((input) => ({ ...input, studentId: false }));
        setErrorTexts((input) => ({ ...input, studentId: '' }));
      } else if (errorTexts[name] === 'StudentIdNotMatchEmail') {
        setErrors((input) => ({ ...input, studentId: false, email: false }));
        setErrorTexts((input) => ({ ...input, studentId: '', email: '' }));
      }
    }

    if (name === 'email') {
      if (errorTexts[name] === 'Email Exists') {
        setErrors((input) => ({ ...input, email: false }));
        setErrorTexts((input) => ({ ...input, email: '' }));
      } else if (errorTexts[name] === 'StudentIdNotMatchEmail') {
        setErrors((input) => ({ ...input, studentId: false, email: false }));
        setErrorTexts((input) => ({ ...input, studentId: '', email: '' }));
      }
    }

    setHasRequest(false);
  };

  const onClosePopup = () => {
    setPopup(false);
    history.push('/login');
  };

  const handleClose = () => {
    setErrorPopup(false);
  };

  const onNextPage = () => {
    const checkError = (name) => {
      if (name === 'username' || name === 'password' || name === 'confirmPassword') return false;
      if (inputs[name].trim() !== '') return false;
      return true;
    };

    setErrors(labelName.reduce((acc, item) => ({ ...acc, [item]: checkError(item) }), {}));
    setErrorTexts(labelName.reduce((acc, item) => ({ ...acc, [item]: checkError(item) ? "Can't be empty" : '' }), {}));
    const hasError = labelName.reduce((acc, item) => acc || checkError(item), false);

    if (!hasError) {
      setNextPage(true);
    }
  };

  useEffect(() => {
    if (!registerLoading && hasRequest) {
      // IllegalCharacter, InvalidInstitute, SystemException
      // StudentCardExists, UsernameExists, StudentIdNotMatchEmail
      if (registerError !== null) {
        switch (registerError) {
          case 'UsernameExists': {
            setErrors((input) => ({ ...input, username: true }));
            setErrorTexts((input) => ({ ...input, username: 'Username Exists' }));
            break;
          }
          case 'StudentCardExists': {
            setErrors((input) => ({ ...input, studentId: true }));
            setErrorTexts((input) => ({ ...input, studentId: 'Student ID Exists' }));
            setNextPage(false);
            break;
          }
          case 'StudentIdNotMatchEmail': {
            setErrors((input) => ({ ...input, studentId: true, email: true }));
            setErrorTexts((input) => ({
              ...input,
              studentId: 'StudentIdNotMatchEmail',
              email: 'StudentIdNotMatchEmail',
            }));
            setNextPage(false);
            break;
          }
          default: {
            setErrorMsg(registerError);
            setErrorPopup(true);
          }
        }
      } else {
        setPopup(true);
      }
    }
  }, [hasRequest, registerError, registerLoading]);

  if (loadingInstitute) {
    return <GeneralLoading />;
  }
  return (
    <>
      {!nextPage ? (
        <Card className="auth-form register-form" variant="outlined">
          <CardContent className="auth-form-content">
            <form className={`auth-form-content ${classNames.authForm}`}>
              <TextField
                id="realName"
                name="realName"
                className={`auth-form-input ${classNames.authTextFields}`}
                label="Real Name"
                value={inputs.realName}
                onChange={(e) => handleChange(e)}
                error={errors.realName}
                helperText={errorTexts.realName}
              />
              <FormControl
                variant="outlined"
                className={`auth-form-input ${classNames.authTextFields}`}
                error={errors.school}
              >
                <InputLabel id="demo-simple-select-outlined-label">School</InputLabel>
                <Select id="school" name="school" value={inputs.school} onChange={handleChange} label="School">
                  {enableInstitutesId.map((item) => (
                    <MenuItem key={item} value={institutes[item].full_name}>
                      {institutes[item].full_name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.school ? <FormHelperText>{errorTexts.school}</FormHelperText> : <></>}
              </FormControl>
              <TextField
                className={`auth-form-input ${classNames.authTextFields}`}
                id="studentId"
                name="studentId"
                label="Student ID"
                value={inputs.studentId}
                onChange={(e) => handleChange(e)}
                error={errors.studentId}
                helperText={errorTexts.studentId}
              />
              <div className={`auth-form-input ${classNames.authTextFieldsComplex} auth-form-input-email`}>
                <TextField
                  id="email"
                  name="email"
                  className="auth-form-input-email-text"
                  label="Email"
                  value={inputs.email}
                  onChange={(e) => handleChange(e)}
                  error={errors.email}
                  helperText={errorTexts.email}
                  style={{ marginLeft: '0px', marginRight: '10px' }}
                />
                <Typography className="auth-form-input-email-tail" variant="h6">
                  {emailTail}
                </Typography>
              </div>
              <div className={classNames.authButtons}>
                <Button onClick={onNextPage} color="primary">
                  Next
                </Button>
              </div>
            </form>
            <Typography variant="body2" className={classNames.authLink}>
              Already have a puppy?
              {' '}
              <Link component={RouterLink} to="/login">
                Log in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card className="auth-form register-form" variant="outlined">
          <CardContent className="auth-form-content">
            <form className={`auth-form-content ${classNames.authForm}`}>
              <TextField
                className={`auth-form-input ${classNames.authTextFields}`}
                id="username"
                name="username"
                label="Username"
                value={inputs.username}
                onChange={(e) => handleChange(e)}
                error={errors.username}
                helperText={errorTexts.username}
              />
              <TextField
                className={`auth-form-input ${classNames.authTextFields}`}
                id="nickname"
                name="nickname"
                label="Nickname"
                value={inputs.nickname}
                onChange={(e) => handleChange(e)}
                error={errors.nickname}
                helperText={errorTexts.nickname}
              />
              <TextField
                // required
                className={`auth-form-input ${classNames.authTextFields}`}
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                // placeholder="New Password"
                value={inputs.password}
                onChange={(e) => handleChange(e)}
                error={errors.password}
                helperText={errorTexts.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                // required
                className={`auth-form-input ${classNames.authTextFields}`}
                name="confirmPassword"
                error={errors.confirmPassword}
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                value={inputs.confirmPassword}
                helperText={errorTexts.confirmPassword}
                onChange={(e) => handleChange(e)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div className={classNames.authButtons}>
                <Button onClick={() => setNextPage(false)}>
                  Back
                </Button>
                <Button onClick={() => onSubmit()} color="primary">
                  Register
                </Button>
              </div>
            </form>
            <Typography variant="body2" className={classNames.authLink}>
              Already have a puppy?
              {' '}
              <Link component={RouterLink} to="/login">
                Log in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={errorPopup}
        onClose={handleClose}
        message={`Error: ${errorMsg}`}
        key="errorMsg"
        className={classNames.snackbar}
      />
      {popup && (
        <Dialog open={popup} keepMounted onClose={() => setPopup(false)}>
          <DialogTitle id="alert-dialog-slide-title">
            <Typography variant="h4">Verification email sent</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Please check your mailbox to activate the account
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClosePopup} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
