import React from 'react';

import { Route, Switch } from 'react-router-dom';
import InstituteSetting from '../../../components/admin/account/InstituteSetting';
import InstituteList from '../../../components/admin/account/InstituteList';
import NoMatch from '../../../components/noMatch';

/* This is a level 3 container (main page container) */
export default function Institute() {
  return (
    <>
      <Switch>
        <Route path="/admin/account/institute/:instituteId/setting" component={InstituteSetting} />
        <Route path="/admin/account/institute" component={InstituteList} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
