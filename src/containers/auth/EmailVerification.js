import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { emailVerification } from '../../actions/user/auth';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    height: '100vh',
  },
  topbar: {
    width: '100%',
    height: '55px',
    backgroundColor: theme.palette.black.main,
  },
  subwrapper: {
    width: '100%',
    height: 'calc(100% - 55px)',
    padding: '50px 170px',
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    // flexWrap: 'wrap',
  },
  picContainer: {
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    position: 'relative',
    top: '50px',
    left: 'calc(50% - 175px)',
    backgroundColor: theme.palette.grey.A500,
  },
  pic: {
    width: '350px',
    height: '350px',
    borderRadius: '50%',
  },
  messageContainer: {
    width: '100%',
    height: '65px',
    lineHeight: '65px',
    textAlign: 'center',
    position: 'relative',
    top: '80px',
    '& span': theme.typography.h3,
  },
  tipsContainer: {
    width: '100%',
    height: '19px',
    lineHeight: '19px',
    textAlign: 'center',
    position: 'relative',
    top: '110px',
    '& span': {
      fontSize: '14px',
      fontFamily: 'Noto Sans',
      fontWeight: 300,
    },
  },
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function EmailVerification() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const query = useQuery();
  const history = useHistory();
  const [message, setMessage] = useState('Email Verifying...');
  const queryString = useCallback(query.get('code'), [query]);

  useEffect(() => {
    const onSuccess = () => {
      setMessage('Email Verify Succeed.');
      setTimeout(() => {
        history.push('/login');
      }, 3000);
    };

    const onError = () => {
      setMessage('Fail to verify Email.');
      setTimeout(() => {
        history.push('/login');
      }, 3000);
    };

    dispatch(emailVerification(queryString, onSuccess, onError));
  }, [dispatch, history, queryString]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.topbar} />
      <div className={classes.subwrapper}>
        {/* <div className={classes.picContainer}>
          <img src={} className={classes.pic} />
        </div> */}
        <div className={classes.picContainer} />
        <div className={classes.messageContainer}>
          <span>{message}</span>
        </div>
        <div className={classes.tipsContainer}>
          <span>Turning to login page in a few seconds.</span>
        </div>
      </div>
    </div>
  );
}
