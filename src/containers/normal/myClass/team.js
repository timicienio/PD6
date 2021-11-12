import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NoMatch from '../../../components/noMatch';
import TeamList from '../../../components/normal/myClass/Team/TeamList';
import TeamDetail from '../../../components/normal/myClass/Team/TeamDetail';

/* This is a level 3 container (main page container) */
export default function Team() {
  return (
    <>
      <Switch>
        <Route exact path="/my-class/:courseId/:classId/team" component={TeamList} />
        <Route path="/my-class/:courseId/:classId/team/:teamId" component={TeamDetail} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
