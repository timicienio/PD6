import React from 'react';

import { Switch, Route } from 'react-router-dom';
import AnnouncementAdd from '../../../components/admin/system/AnnouncementAdd';
import AnnouncementHome from '../../../components/admin/system/AnnouncementHome';
import AnnouncementSetting from '../../../components/admin/system/AnnouncementSetting';
import NoMatch from '../../../components/noMatch';

// import AnnouncementAdd from '../../../components/admin/system/AnnouncementAdd';

/* This is a level 3 container (main page container) */
export default function AnnouncementInfo() {
  return (
    <>
      <Switch>
        <Route path="/admin/system/announcement/add" component={AnnouncementAdd} />
        <Route path="/admin/system/announcement/:announcementId/setting" component={AnnouncementSetting} />
        <Route exact path="/admin/system/announcement" component={AnnouncementHome} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
