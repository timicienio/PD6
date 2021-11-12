import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Grid, Typography } from '@material-ui/core';

import LoginForm from './LoginForm';
import Trademark from '../../components/auth/Trademark';

import '../../styles/auth.css';
import '../../styles/index.css';

export default function Login() {
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  const [, setCookie] = useCookies(['id', 'token']);

  useEffect(() => {
    document.title = 'Signin';
    return () => {
      document.title = 'PDOGS';
    };
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setCookie('id', user.id, { path: '/', maxAge: 86400 });
      setCookie('token', auth.token, { path: '/', maxAge: 86400 });
      history.push('/');
    }
  }, [auth.isAuthenticated, auth.token, history, setCookie, user.id]);

  return (
    <div className="page auth-page">
      <Grid className="auth-page-container" container direction="row" justifyContent="center" alignItems="center">
        <Grid container item xs={6} className="auth-page-col auth-page-col-left" justifyContent="center">
          <Typography className="auth-title" variant="h3">
            Login and train your puppy!
          </Typography>
        </Grid>
        <Grid container item xs={6} className="auth-page-col auth-page-col-right" justifyContent="center">
          <LoginForm />
        </Grid>
        <Trademark />
      </Grid>
    </div>
  );
}
