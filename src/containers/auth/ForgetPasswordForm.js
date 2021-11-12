import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Link,
} from '@material-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { userForgetPassword } from '../../actions/user/auth';

import '../../styles/auth.css';
import '../../styles/index.css';

const useStyles = makeStyles((theme) => ({
  authForm: {
    width: '50%',
  },
  authTextFields: {
    width: '100%',
    marginTop: '55px',
  },
  authButtons: {
    marginTop: '44px',
    marginBottom: '30px',
  },
  authLink: {
    color: theme.palette.grey.A400,
  },
}));

export default function ForgetPasswordForm() {
  const classNames = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  // const error = useSelector((state) => state.error.user.auth);
  // const loading = useSelector((state) => state.loading.user.auth.forgetPassword);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [popUp, setPopUp] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (showError) {
      return;
    }

    const onSuccess = () => {
      setPopUp(true);
      setErrorText('');
      setShowError(false);

      setTimeout(() => {
        history.push('/login');
      }, 3000);
    };

    const onError = () => {
      setErrorText('Error');
      setShowError(true);
    };

    dispatch(userForgetPassword(username, email.trim(), onSuccess, onError));
  };

  const handleClosePopUp = () => {
    setPopUp(false);
  };

  useEffect(() => {
    const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const status = emailRe.test(email);

    if (username === '') {
      setDisabled(true);
    } else if (email === '') {
      setErrorText('');
      setShowError(false);
      setDisabled(true);
    } else if (!status) {
      setErrorText('Invalid email address');
      setShowError(true);
      setDisabled(true);
    } else {
      setErrorText('');
      setShowError(false);
      setDisabled(false);
    }
  }, [email, username]);

  return (
    <>
      <Card className="auth-form login-form" variant="outlined">
        <CardContent className="auth-form-content">
          <form className={`auth-form-content ${classNames.authForm}`} onSubmit={(e) => handleSubmit(e)}>
            <TextField
              // required
              className={`auth-form-input ${classNames.authTextFields}`}
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              // required
              className={`auth-form-input ${classNames.authTextFields}`}
              error={showError}
              helperText={errorText}
              label="Registered / Alternative Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className={classNames.authButtons}
              disabled={disabled}
              type="submit"
              color="primary"
              onClick={(e) => handleSubmit(e)}
            >
              Send
            </Button>
          </form>

          <Typography variant="body2" className={classNames.authLink}>
            Forgot your username?
            {' '}
            <Link component={RouterLink} to="/forget-username">
              Find username
            </Link>
            {' '}
          </Typography>
        </CardContent>
      </Card>

      <Dialog
        open={popUp}
        keepMounted
        onClose={() => handleClosePopUp()}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Typography variant="h4">Password reset email sent</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">Please check your mailbox to the account.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClosePopUp()} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
