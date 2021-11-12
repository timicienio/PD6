import React from 'react';
import { Switch, Route } from 'react-router-dom';

import AccessLogComponent from '../../../components/admin/system/AccessLog';
import NoMatch from '../../../components/noMatch';

/* This is a level 3 container (main page container) */
export default function AccessLog() {
  return (
    <>
      <Switch>
        <Route path="/admin/system/accesslog" component={AccessLogComponent} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
