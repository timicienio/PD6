import React from 'react';
import { Switch, Route } from 'react-router-dom';
import GradeList from '../../../components/normal/myClass/Grade/GradeList';
import GradeDetail from '../../../components/normal/myClass/Grade/GradeDetail';
import NoMatch from '../../../components/noMatch';

/* This is a level 3 container (main page container) */
export default function Grade() {
  return (
    <>
      <Switch>
        <Route exact path="/my-class/:courseId/:classId/grade" component={GradeList} />
        <Route path="/my-class/:courseId/:classId/grade/:gradeId" component={GradeDetail} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
