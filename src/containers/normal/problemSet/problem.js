import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ProblemList from '../../../components/normal/problemSet/ProblemList';
import ProblemDetail from '../../../components/normal/problemSet/ProblemDetail';
import ChallengeInfo from '../../../components/normal/problemSet/ChallengeInfo';
import CodeSubmission from '../../../components/normal/problemSet/CodeSubmission';
import MySubmission from '../../../components/normal/problemSet/MySubmission';
import SubmissionDetail from '../../../components/normal/problemSet/SubmissionDetail';
import NoMatch from '../../../components/noMatch';

/* This is a level 3 container (main page container) */
function Problem() {
  return (
    <>
      <Switch>
        <Route exact path="/problem-set" component={ProblemList} />
        <Route exact path="/problem-set/:courseId/:classId" component={ProblemList} />
        <Route exact path="/problem-set/:courseId/:classId/challenge/:challengeId" component={ChallengeInfo} />
        <Route
          exact
          path="/problem-set/:courseId/:classId/challenge/:challengeId/:problemId"
          component={ProblemDetail}
        />
        <Route
          exact
          path="/problem-set/:courseId/:classId/challenge/:challengeId/:problemId/code-submission"
          component={CodeSubmission}
        />
        <Route
          exact
          path="/problem-set/:courseId/:classId/challenge/:challengeId/:problemId/my-submission"
          component={MySubmission}
        />
        <Route
          exact
          path="/problem-set/:courseId/:classId/challenge/:challengeId/:problemId/my-submission/:submissionId"
          component={SubmissionDetail}
        />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}

export default Problem;
