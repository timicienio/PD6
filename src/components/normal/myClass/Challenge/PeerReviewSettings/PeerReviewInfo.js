import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Typography,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Snackbar,
} from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import { MathpixMarkdown, MathpixLoader } from 'mathpix-markdown-it';

import BasicInfo from './Element/BasicInfo';
import Overview from './Element/Overview';
import NoMatch from '../../../../noMatch';
import GeneralLoading from '../../../../GeneralLoading';
import PeerReviewEdit from './PeerReviewEdit';
import PageTitle from '../../../../ui/PageTitle';
import SimpleBar from '../../../../ui/SimpleBar';
import AlignedText from '../../../../ui/AlignedText';

import { readPeerReview, deletePeerReview } from '../../../../../actions/api/peerReview';
import {
  browseAccountAllPeerReviewRecordWithReading,
  assignPeerReviewRecordAndPush,
} from '../../../../../actions/myClass/peerReview';

const useStyles = makeStyles(() => ({
  generalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  managerButtons: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
}));

/* This is a level 4 component (page component) */
// This page is for both normal and manager.
// Render different component according to role and call correct api (PeerReviewEdit, BasicInfo, Overview)
export default function PeerReviewInfo() {
  const {
    courseId, classId, challengeId, peerReviewId,
  } = useParams();
  const classNames = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const authToken = useSelector((state) => state.auth.token);
  const accountId = useSelector((state) => state.user.id);
  const userClasses = useSelector((state) => state.user.classes);
  const classes = useSelector((state) => state.classes.byId);
  const courses = useSelector((state) => state.courses.byId);
  const challenges = useSelector((state) => state.challenges.byId);
  const peerReviews = useSelector((state) => state.peerReviews.byId);
  const apiLoading = useSelector((state) => state.loading.api.peerReview);
  const errors = useSelector((state) => state.error.api.peerReview);

  const [role, setRole] = useState('GUEST');
  const [edit, setEdit] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment());
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

  const clickViewPeerReview = () => {
    history.push(
      `/my-class/${courseId}/${classId}/challenge/${challengeId}/peer-review/${peerReviewId}/receiver-summary`,
    );
  };

  const clickReceivedPeerReviews = () => {
    if (peerReviews[peerReviewId].receiveRecordIds.length !== 0) {
      const targetRecordId = peerReviews[peerReviewId].receiveRecordIds.sort((a, b) => a - b)[0];
      history.push(
        `/my-class/${courseId}/${classId}/challenge/${challengeId}/peer-review/${peerReviewId}/receive/${accountId}/${targetRecordId}`,
      );
    } else {
      setShowSnackbar(true);
    }
  };

  const clickPeerReview = () => {
    const reviewPeerReviewRecordIds = peerReviews[peerReviewId].reviewRecordIds;
    if (reviewPeerReviewRecordIds.length < peerReviews[peerReviewId].max_review_count) {
      dispatch(
        assignPeerReviewRecordAndPush(authToken, courseId, classId, challengeId, peerReviewId, accountId, history, () => { setShowErrorSnackbar(true); }),
      );
    } else {
      const targetRecordId = reviewPeerReviewRecordIds.sort((a, b) => a - b)[0];
      history.push(
        `/my-class/${courseId}/${classId}/challenge/${challengeId}/peer-review/${peerReviewId}/review/${accountId}/${targetRecordId}`,
      );
    }
  };

  const clickDelete = () => {
    dispatch(deletePeerReview(authToken, peerReviewId, challengeId));
    history.push(`/my-class/${courseId}/${classId}/challenge/${challengeId}`);
  };

  useEffect(() => {
    if (userClasses.filter((item) => item.class_id === Number(classId)).length !== 0) {
      setRole(userClasses.filter((item) => item.class_id === Number(classId))[0].role);
    }
  }, [classId, userClasses]);

  useEffect(() => {
    if (!apiLoading.editPeerReview) {
      dispatch(readPeerReview(authToken, peerReviewId));
      setCurrentTime(moment());
    }
  }, [authToken, dispatch, apiLoading.editPeerReview, peerReviewId]);

  useEffect(() => {
    if (!apiLoading.assignPeerReviewRecord) {
      dispatch(browseAccountAllPeerReviewRecordWithReading(authToken, peerReviewId, accountId));
    }
  }, [authToken, dispatch, peerReviewId, accountId, apiLoading.assignPeerReviewRecord]);

  if (peerReviews[peerReviewId] === undefined) {
    if (
      apiLoading.editPeerReview
      || apiLoading.assignPeerReviewRecord
    ) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  if (role === 'GUEST') {
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle
        text={`${challenges[challengeId] === undefined ? 'error' : challenges[challengeId].title} / ${
          peerReviews[peerReviewId] === undefined ? 'error' : peerReviews[peerReviewId].challenge_label
        }`}
      />
      {role === 'MANAGER' ? (
        <>
          {!edit && (
            <div className={classNames.managerButtons}>
              <Button onClick={() => setEdit(true)}>Edit</Button>
              <Button onClick={clickViewPeerReview}>View Peer Review</Button>
            </div>
          )}
        </>
      ) : (
        <div className={classNames.generalButtons}>
          <Button
            variant="outlined"
            onClick={clickReceivedPeerReviews}
            disabled={currentTime.isBefore(moment(challenges[challengeId].end_time))}
          >
            Received Peer Reviews
          </Button>
          <Button color="primary" onClick={clickPeerReview}>
            Start Peer Review
          </Button>
        </div>
      )}
      {edit ? (
        <PeerReviewEdit setEdit={setEdit} />
      ) : (
        <>
          <SimpleBar title="Title">{peerReviews[peerReviewId].title}</SimpleBar>
          {role === 'MANAGER' && (
            <SimpleBar title="Description">
              <MathpixLoader>
                <MathpixMarkdown text={peerReviews[peerReviewId].description} htmlTags />
              </MathpixLoader>
            </SimpleBar>
          )}
          <BasicInfo role={role} />
          {role === 'MANAGER' && (
            <SimpleBar
              title="Delete Task"
              childrenButtons={(
                <>
                  <Button color="secondary" onClick={() => setDeletePopUp(true)}>
                    Delete
                  </Button>
                </>
              )}
            >
              <Typography variant="body1">Once you delete a task, there is no going back. Please be certain.</Typography>
            </SimpleBar>
          )}
          {role !== 'MANAGER' && <Overview peerReviewId={peerReviewId} />}
        </>
      )}
      <Dialog open={deletePopUp} onClose={() => setDeletePopUp(false)} maxWidth="md">
        <DialogTitle>
          <Typography variant="h4">Delete Problem</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Class" childrenType="text" textColor="secondary">
            <Typography variant="body1">{`${courses[courseId].name} ${classes[classId].name}`}</Typography>
          </AlignedText>
          <AlignedText text="Title" childrenType="text" textColor="secondary">
            <Typography variant="body1">
              {peerReviews[peerReviewId] === undefined ? 'error' : peerReviews[peerReviewId].title}
            </Typography>
          </AlignedText>
          <AlignedText text="Label" childrenType="text" textColor="secondary">
            <Typography variant="body1">
              {peerReviews[peerReviewId] === undefined ? 'error' : peerReviews[peerReviewId].challenge_label}
            </Typography>
          </AlignedText>
          <Typography variant="body2">Once you delete a problem, there is no going back. Please be certain.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletePopUp(false)}>Cancel</Button>
          <Button color="secondary" onClick={clickDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackbar(false);
        }}
        message={"Your task hasn't been assigned to any peer yet."}
      />
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowErrorSnackbar(false);
        }}
        message={`Error:  ${errors.assignPeerReviewRecord}`}
      />
    </>
  );
}
