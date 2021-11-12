import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import Trademark from '../../components/auth/Trademark';
import ForgetPasswordForm from './ForgetPasswordForm';

import '../../styles/auth.css';
import '../../styles/index.css';

export default function ForgetPassword() {
  return (
    <div className="page auth-page">
      <Grid className="auth-page-container" container direction="row" justifyContent="center" alignItems="center">
        <Grid container item xs={6} className="auth-page-col auth-page-col-left" justifyContent="center">
          <Grid item className="auth-title" />
          <Typography className="auth-title" variant="h3">
            Lost your puppy? Reset Password
          </Typography>
        </Grid>
        <Grid container item xs={6} className="auth-page-col auth-page-col-right" justifyContent="center">
          <ForgetPasswordForm />
        </Grid>
        <Trademark />
      </Grid>
    </div>
  );
}
