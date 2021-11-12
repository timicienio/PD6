import React from 'react';

import { Switch, Route } from 'react-router-dom';
import NoMatch from '../../../components/noMatch';
import PlaceHolder from './placeHolder';

import Challenge from './challenge';

/* This is a level 2 container (role container) */
function AllClass() {
  return (
    <Switch>
      <Route exact path="/all-class" component={PlaceHolder} />
      <Route exact path="/all-class/:courseId" component={PlaceHolder} />
      <Route exact path="/all-class/:courseId/:classId/challenge" component={Challenge} />
      <Route path="/all-class/:courseId/:classId/challenge/:challengeId" component={Challenge} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default AllClass;
