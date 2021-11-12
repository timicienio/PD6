import React from 'react';

import { Route, Switch } from 'react-router-dom';

import SubmissionLanguageHome from '../../../components/admin/system/SubmissionLanguageHome';
import LangSetting from '../../../components/admin/system/SubmissionLanguageSetting';
import NoMatch from '../../../components/noMatch';

/* This is a level 3 container (main page container) */
export default function SubmitLang() {
  return (
    <>
      <Switch>
        <Route path="/admin/system/submitlang/:languageId/setting" component={LangSetting} />
        <Route exact path="/admin/system/submitlang" component={SubmissionLanguageHome} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
