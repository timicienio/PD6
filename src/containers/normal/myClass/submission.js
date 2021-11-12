import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SubmissionList from '../../../components/normal/myClass/Submission/SubmissionList';
import SubmissionDetail from '../../../components/normal/myClass/Submission/SubmissionDetail';
import NoMatch from '../../../components/noMatch';

/* This is a level 3 container (main page container) */
export default function Submission() {
  return (
    <>
      <Switch>
        <Route exact path="/my-class/:courseId/:classId/submission" component={SubmissionList} />
        <Route path="/my-class/:courseId/:classId/submission/:submissionId" component={SubmissionDetail} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
