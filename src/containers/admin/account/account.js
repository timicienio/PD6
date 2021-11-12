import React from 'react';

import { Switch, Route } from 'react-router-dom';
import AccountSetting from '../../../components/admin/account/setting/AccountSetting';
import AccountList from '../../../components/admin/account/AccountList';
import NoMatch from '../../../components/noMatch';

/* This is a level 3 container (main page container) */
export default function Account() {
  return (
    <>
      <Switch>
        <Route path="/admin/account/account/:accountId/setting" component={AccountSetting} />
        <Route path="/admin/account/account/" component={AccountList} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
