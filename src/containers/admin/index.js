import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Account from './account/account';
import Institute from './account/institute';
import Class from './course/class';
import Course from './course/course';
import AccessLog from './system/accessLog';
import SubmitLang from './system/submitLang';
import Announcement from './system/announcement';

import NoMatch from '../../components/noMatch';

/* This is a level 2 container (role container) */
export default function Admin() {
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (auth.isAuthenticated) {
      if (user.role.indexOf('MANAGER') === -1) {
        history.push('/notFound');
      }
    }
  }, [auth.isAuthenticated, history, user.role]);

  return (
    <Switch>
      <Route path="/admin/course/course" component={Course} />
      <Route path="/admin/course/class/:courseId/:classId" component={Class} />
      <Route path="/admin/account/institute" component={Institute} />
      <Route path="/admin/account/account" component={Account} />
      <Route path="/admin/system/accesslog" component={AccessLog} />
      <Route path="/admin/system/announcement" component={Announcement} />
      <Route path="/admin/system/submitlang" component={SubmitLang} />
      <Route component={NoMatch} />
    </Switch>
  );
}
