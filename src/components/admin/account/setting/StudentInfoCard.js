import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button, Card, CardContent, Typography, makeStyles, Snackbar,
} from '@material-ui/core';
import AlignedText from '../../../ui/AlignedText';
import Icon from '../../../ui/icon/index';
import {
  deletePendingStudentCard,
  makeStudentCardDefault,
  resendEmailVerification,
} from '../../../../actions/admin/account';

const useStyles = makeStyles(() => ({
  root: {
    width: '600px',
  },
  defaultHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10px',
  },
  starIcon: {
    marginRight: '5px',
  },
  pendingIcon: {
    marginRight: '13px',
  },
  cardContent: {
    height: '106px',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    '&:last-child': {
      padding: '20px 0px 20px 30px',
    },
  },
  editCardContent: {
    height: '168px',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    '&:last-child': {
      padding: '20px 0px 20px 30px',
    },
  },
  defaultButton: {
    alignSelf: 'flex-end',
    marginRight: '23px',
  },
}));

export default function StudentInfoCard(props) {
  const classes = useStyles();
  const disabled = props.isDefault;
  const authToken = useSelector((state) => state.auth.token);
  const institutes = useSelector((state) => state.institutes.byId);
  const institutesId = useSelector((state) => state.institutes.allIds);
  const [snackbar, setSnackbar] = useState(false);
  const dispatch = useDispatch();
  const { accountId } = useParams();

  const handleSetDefault = (cardId) => {
    dispatch(makeStudentCardDefault(authToken, accountId, cardId));
  };

  const handleResend = (emailVerificationId) => {
    dispatch(resendEmailVerification(authToken, emailVerificationId));
    setSnackbar(true);
  };

  const handleDelete = (emailVerificationId) => {
    dispatch(deletePendingStudentCard(authToken, emailVerificationId));
  };

  const transform = (instituteId) => {
    const institute = institutesId.filter((id) => id === instituteId);
    if (institute.length !== 0) {
      return institutes[institute[0]].full_name;
    }
    return 'Unknown Institute';
  };

  return (
    <div className={classes.root}>
      <div className={classes.defaultHeader}>
        {props.isDefault && <Icon.StarIcon style={{ color: 'ffe81e' }} className={classes.starIcon} />}
        {props.pending && <Icon.Warning style={{ color: '656565' }} className={classes.pendingIcon} />}
        <Typography variant="body1">{transform(props.instituteId)}</Typography>
      </div>
      <Card variant="outlined">
        {!props.pending ? (
          <CardContent className={classes.editCardContent}>
            <div>
              <AlignedText text="Student ID" childrenType="text">
                <Typography variant="body1">{props.studentId}</Typography>
              </AlignedText>
            </div>
            <div>
              <AlignedText text="Email" childrenType="text">
                <Typography variant="body1">{props.email}</Typography>
              </AlignedText>
            </div>
            <div className={classes.defaultButton}>
              <Button
                disabled={disabled}
                onClick={() => {
                  handleSetDefault(props.id);
                }}
              >
                Set as Default
              </Button>
            </div>
          </CardContent>
        ) : (
          <CardContent className={classes.editCardContent}>
            <div>
              <AlignedText text="Student ID" childrenType="text">
                <Typography variant="body1">{props.studentId}</Typography>
              </AlignedText>
            </div>
            <div>
              <AlignedText text="Email" childrenType="text">
                <Typography variant="body1">{props.email}</Typography>
              </AlignedText>
            </div>
            <div className={classes.defaultButton}>
              <Button
                onClick={() => {
                  handleDelete(props.id);
                }}
              >
                Delete
              </Button>
              <Button
                onClick={() => {
                  handleResend(props.id);
                }}
                color="primary"
              >
                Resend
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        message="Verification email sent! Please check your mailbox."
        onClose={() => setSnackbar(false)}
      />
    </div>
  );
}
