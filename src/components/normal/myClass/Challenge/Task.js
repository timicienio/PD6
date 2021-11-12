import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, useParams } from 'react-router-dom';

import CodingProblem from './CodingProblem';

import GeneralLoading from '../../../GeneralLoading';
import EssayProblem from './EssayProblem';
import CodeSubmission from './CodeSubmission';
import MySubmission from './MySubmission';
import SubmissionDetail from './SubmissionDetail';
import PeerReview from './PeerReview';
import Scoreboard from './Scoreboard';
import NoMatch from '../../../noMatch';

/* This is a level 4 component (page component) */
/* judge the problem type on this level */
export default function Task() {
  const { courseId, classId, challengeId } = useParams();

  // const problemIDs = useSelector((state) => state.problem.allIds);
  // const authToken = useSelector((state) => state.auth.token);
  // const error = useSelector((state) => state.error);
  // const loading = useSelector((state) => state.loading.myClass.problem);
  const commonLoading = useSelector((state) => state.loading.common);
  const classes = useSelector((state) => state.classes.byId);
  const courses = useSelector((state) => state.courses.byId);
  const challenges = useSelector((state) => state.challenges.byId);

  // const dispatch = useDispatch();
  if (challenges[challengeId] === undefined || courses[courseId] === undefined || classes[classId] === undefined) {
    if (commonLoading.fetchCourse || commonLoading.fetchClass || commonLoading.fetchChallenge) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <Switch>
        <Route
          exact
          path="/my-class/:courseId/:classId/challenge/:challengeId/essay/:essayId"
          component={EssayProblem}
        />
        <Route
          exact
          path="/my-class/:courseId/:classId/challenge/:challengeId/:problemId/code-submission"
          component={CodeSubmission}
        />
        <Route
          exact
          path="/my-class/:courseId/:classId/challenge/:challengeId/:problemId/my-submission"
          component={MySubmission}
        />
        <Route
          exact
          path="/my-class/:courseId/:classId/challenge/:challengeId/:problemId/my-submission/:submissionId"
          component={SubmissionDetail}
        />
        <Route exact path="/my-class/:courseId/:classId/challenge/:challengeId/:problemId" component={CodingProblem} />
        <Route
          path="/my-class/:courseId/:classId/challenge/:challengeId/peer-review/:peerReviewId"
          component={PeerReview}
        />
        <Route
          exact
          path="/my-class/:courseId/:classId/challenge/:challengeId/scoreboard/:scoreboardId"
          component={Scoreboard}
        />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
