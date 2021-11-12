import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useParams } from 'react-router-dom';

// import { readPeerReview } from '../../../../actions/api/peerReview';
import { readPeerReviewWithProblem } from '../../../../actions/myClass/peerReview';

import GeneralLoading from '../../../GeneralLoading';
import PeerReviewInfo from './PeerReviewSettings/PeerReviewInfo';
import ReceiverSummary from './PeerReviewSettings/ReceiverSummary';
import GraderSummary from './PeerReviewSettings/GraderSummary';
import ReviewedRecord from './PeerReviewSettings/ReviewedRecord';
import ReceivedRecord from './PeerReviewSettings/ReceivedRecord';
import NoMatch from '../../../noMatch';

/* This is a level 4 component (page component) */
/* judge the problem type on this level */
export default function PeerReview() {
  const {
    courseId, classId, challengeId, peerReviewId,
  } = useParams();
  const dispatch = useDispatch();

  // const problemIDs = useSelector((state) => state.problem.allIds);
  const authToken = useSelector((state) => state.auth.token);
  // const error = useSelector((state) => state.error);
  // const loading = useSelector((state) => state.loading.api.peerReview);
  const pageLoading = useSelector((state) => state.loading.myClass.peerReview);
  const commonLoading = useSelector((state) => state.loading.common);
  const classes = useSelector((state) => state.classes.byId);
  const courses = useSelector((state) => state.courses.byId);
  const challenges = useSelector((state) => state.challenges.byId);
  const peerReviews = useSelector((state) => state.peerReviews.byId);

  useEffect(() => {
    if (peerReviewId !== undefined) {
      // dispatch(readPeerReview(authToken, peerReviewId));
      dispatch(readPeerReviewWithProblem(authToken, peerReviewId));
    }
  }, [authToken, dispatch, peerReviewId]);

  // const dispatch = useDispatch();
  if (challenges[challengeId] === undefined || courses[courseId] === undefined || classes[classId] === undefined || peerReviews[peerReviewId] === undefined) {
    if (commonLoading.fetchCourse || commonLoading.fetchClass || commonLoading.fetchChallenge || pageLoading.readPeerReviewWithProblem) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <Switch>
        <Route exact path="/my-class/:courseId/:classId/challenge/:challengeId/peer-review/:peerReviewId" component={PeerReviewInfo} />
        <Route exact path="/my-class/:courseId/:classId/challenge/:challengeId/peer-review/:peerReviewId/receive/:accountId/:recordId" component={ReceivedRecord} />
        <Route exact path="/my-class/:courseId/:classId/challenge/:challengeId/peer-review/:peerReviewId/review/:accountId/:recordId" component={ReviewedRecord} />
        <Route path="/my-class/:courseId/:classId/challenge/:challengeId/peer-review/:peerReviewId/receiver-summary/:is_null?" component={ReceiverSummary} />
        <Route path="/my-class/:courseId/:classId/challenge/:challengeId/peer-review/:peerReviewId/grader-summary/:is_null?" component={GraderSummary} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
