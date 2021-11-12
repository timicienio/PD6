import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Problem from './problem';
import NoMatch from '../../../components/noMatch';

/* This is a level 2 container (role container) */
function ProblemSet() {
  return (
    <Switch>
      <Route exact path="/problem-set" component={Problem} />
      <Route path="/problem-set/:courseId/:classId" component={Problem} />
      <Route component={NoMatch} />
    </Switch>
  );
}

export default ProblemSet;
