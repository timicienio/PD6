import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import RegisterForm from './RegisterForm';
import Trademark from '../../components/auth/Trademark';

import '../../styles/auth.css';
import '../../styles/index.css';

export default function Register() {
  return (
    <div className="page auth-page">
      <Grid className="auth-page-container" container direction="row" justifyContent="center" alignItems="center">
        <Grid container item xs={6} className="auth-page-col auth-page-col-left" justifyContent="center">
          <Typography className="auth-title" variant="h3">
            Register and adopt a puppy...
          </Typography>
        </Grid>
        <Grid container item xs={6} className="auth-page-col auth-page-col-right" justifyContent="center">
          <RegisterForm />
        </Grid>
        <Trademark />
      </Grid>
    </div>
  );
}
