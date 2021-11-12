import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MemberList from '../../../components/normal/myClass/Member/MemberList';
import NoMatch from '../../../components/noMatch';

/* This is a level 3 container (main page container) */
export default function Member() {
  return (
    <>
      <Switch>
        <Route path="/my-class/:courseId/:classId/member" component={MemberList} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
