import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  makeStyles,
} from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import { MathpixMarkdown, MathpixLoader } from 'mathpix-markdown-it';
import Icon from '../../../../ui/icon/index';

import AlignedText from '../../../../ui/AlignedText';
import SimpleBar from '../../../../ui/SimpleBar';
import PageTitle from '../../../../ui/PageTitle';

import BasicInfo from './Element/BasicInfo';
import ReceiverInfo from './Element/ReceiverInfo';
import GraderInfo from './Element/GraderInfo';
import CodeArea from '../../../../ui/CodeArea';
import NoMatch from '../../../../noMatch';
import GeneralLoading from '../../../../GeneralLoading';

import { browseAccountReviewedPeerReviewRecord, submitPeerReviewRecord } from '../../../../../actions/api/peerReview';
import { readPeerReviewRecordWithCode } from '../../../../../actions/myClass/peerReview';

const useStyles = makeStyles((theme) => ({
  textfield: {
    width: '40vw',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  textLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.hover,
    },
    '&:active': {
      color: theme.palette.primary.dark,
    },
  },
  newTabIcon: {
    marginLeft: '10px',
    transform: 'translateY(2px)',
    color: theme.palette.black.main,
  },
}));

/* This is a level 4 component (page component) */
// This page is for both normal and manager.
// Render different component according to role and call correct api.
// If normal, account id should be himself.
// Only normal has edit mode.
export default function ReviewedRecord() {
  const {
    courseId, classId, challengeId, peerReviewId, accountId, recordId,
  } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [role, setRole] = useState('GUEST');
  const [edit, setEdit] = useState(false);
  const [peerId, setPeerId] = useState(-1);
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

  const authToken = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.loading.api.peerReview);
  const pageLoading = useSelector((state) => state.loading.myClass.peerReview);
  // const error = useSelector((state) => state.error.api.peerReviews);
  const commonLoading = useSelector((state) => state.loading.common.common);
  const userClasses = useSelector((state) => state.user.classes);
  const problems = useSelector((state) => state.problem.byId);
  const challenges = useSelector((state) => state.challenges.byId);
  const peerReviews = useSelector((state) => state.peerReviews.byId);
  const peerReviewRecords = useSelector((state) => state.peerReviewRecords.byId);
  const errors = useSelector((state) => state.error.api.peerReview);

  const onSuccess = () => {
    dispatch(readPeerReviewRecordWithCode(authToken, recordId));
  };

  const handleSubmit = () => {
    // dispatch submit review result
    dispatch(submitPeerReviewRecord(authToken, recordId, score, comment, onSuccess, () => { setShowErrorSnackbar(true); }));
    setEdit(false);
  };

  useEffect(() => {
    if (peerReviewRecords[recordId] !== undefined) {
      if (peerReviewRecords[recordId].score !== null) {
        setScore(peerReviewRecords[recordId].score);
      }
      if (peerReviewRecords[recordId].comment !== null) {
        setComment(peerReviewRecords[recordId].comment);
      }
    }
  }, [peerReviewRecords, recordId]);

  useEffect(() => {
    if (peerReviews[peerReviewId] !== undefined) {
      const id = peerReviews[peerReviewId].reviewRecordIds.findIndex((element) => element === Number(recordId));
      if (id !== -1) {
        setPeerId(id + 1);
      }
    }
  }, [peerReviewId, peerReviews, recordId]);

  useEffect(() => {
    const newRole = userClasses.filter((item) => item.class_id === Number(classId))[0].role;
    if (newRole !== null || newRole !== undefined) {
      setRole(newRole);
    }
  }, [classId, userClasses]);

  useEffect(() => {
    // dispatch read review ids for this account
    dispatch(browseAccountReviewedPeerReviewRecord(authToken, peerReviewId, accountId));
    // dispatch read record with code
    dispatch(readPeerReviewRecordWithCode(authToken, recordId));
  }, [accountId, authToken, dispatch, peerReviewId, recordId]);

  if (challenges[challengeId] === undefined || peerReviews[peerReviewId] === undefined || peerReviewRecords[recordId] === undefined) {
    // console.log(loading);
    if (commonLoading.fetchChallenge || loading.readPeerReviewWithProblem || pageLoading.readPeerReviewRecord) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  if (role === 'GUEST' || peerId === -1) {
    return <NoMatch />;
  }

  return (
    <>
      {role === 'MANAGER'
        ? <PageTitle text={`Peer Review Detail / Peer ${peerId}`} />
        : <PageTitle text={`${challenges[challengeId].title} / ${peerReviews[peerReviewId].challenge_label} / Peer ${peerId}`} />}

      {role === 'NORMAL'
                && (
                <SimpleBar title="Original Problem">
                  {peerReviews[peerReviewId].target_challenge_id !== null
                  && (
                  <Link className={classes.textLink} to={`/my-class/${courseId}/${classId}/challenge/${peerReviews[peerReviewId].target_challenge_id}/${peerReviews[peerReviewId].target_problem_id}`} target="_blank" rel="noopener noreferrer">
                    {`${challenges[peerReviews[peerReviewId].target_challenge_id] && challenges[peerReviews[peerReviewId].target_challenge_id].title} / ${problems[peerReviews[peerReviewId].target_problem_id] && problems[peerReviews[peerReviewId].target_problem_id].challenge_label}`}
                    <Icon.NewWin className={classes.newTabIcon} />
                  </Link>
                  )}
                </SimpleBar>
                )}

      {role === 'MANAGER' ? <BasicInfo />
        : (
          <SimpleBar title="Description">
            <MathpixLoader>
              <MathpixMarkdown text={peerReviews[peerReviewId].description} htmlTags />
            </MathpixLoader>
          </SimpleBar>
        )}
      {role === 'MANAGER'
          && (
          <>
            <ReceiverInfo accountId={peerReviewRecords[recordId].receiver_id} />
            <GraderInfo accountId={peerReviewRecords[recordId].grader_id} reviewedTime={peerReviewRecords[recordId].submit_time} />
          </>
          )}

      <SimpleBar title="Code" noIndent>
        <CodeArea value={peerReviewRecords[recordId].code === null ? '' : peerReviewRecords[recordId].code} />
      </SimpleBar>
      {role === 'MANAGER'
          && (
          <>
            <SimpleBar title="Score">
              { peerReviewRecords[recordId].score === null ? '' : peerReviewRecords[recordId].score}
            </SimpleBar>
            <SimpleBar title="Comment">
              { peerReviewRecords[recordId].comment === null ? '' : peerReviewRecords[recordId].comment}
            </SimpleBar>
          </>
          )}
      {
        role === 'NORMAL' && (edit ? (
          <>
            <SimpleBar title="Review">
              <AlignedText text="Score" childrenType="field">
                <FormControl variant="outlined">
                  <Select
                    labelId="score"
                    id="score"
                    value={score}
                    onChange={(e) => {
                      setScore(e.target.value);
                    }}
                  >
                    {Array.from(new Array(peerReviews[peerReviewId].max_score - peerReviews[peerReviewId].min_score + 1), (x, i) => i + peerReviews[peerReviewId].min_score).map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </AlignedText>
              <AlignedText text="Comment" childrenType="field">
                <TextField
                  value={comment}
                  variant="outlined"
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  className={classes.textfield}
                  multiline
                  minRows={5}
                  maxRows={5}
                />
              </AlignedText>
            </SimpleBar>
            <div className={classes.buttons}>
              <Button color="default" onClick={() => { setEdit(false); }}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </>
        ) : (
          <>
            <SimpleBar title="Review" buttons={<Button onClick={() => setEdit(true)}>Edit</Button>}>
              <AlignedText text="Score" childrenType="text">
                <Typography variant="body1">
                  { peerReviewRecords[recordId].score === null ? '' : peerReviewRecords[recordId].score}
                </Typography>
              </AlignedText>
              <AlignedText text="Comment" childrenType="text">
                <Typography variant="body1">
                  { peerReviewRecords[recordId].comment === null ? '' : peerReviewRecords[recordId].comment}
                </Typography>
              </AlignedText>
            </SimpleBar>
          </>
        ))
      }
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowErrorSnackbar(false);
        }}
        message={`Error:  ${errors.submitPeerReviewRecord}`}
      />
    </>
  );
}
