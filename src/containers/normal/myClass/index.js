import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Switch, Route, useParams, useHistory,
} from 'react-router-dom';

import Challenge from './challenge';
import ChallengeList from '../../../components/normal/myClass/Challenge/ChallengeList';
import Submission from './submission';
import Grade from './grade';
import Team from './team';
import Member from './member';

import { fetchClass, fetchCourse } from '../../../actions/common/common';

import NoMatch from '../../../components/noMatch';

/* This is a level 2 container (role container) */
export default function MyClass() {
  const history = useHistory();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const { courseId, classId } = useParams();
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (auth.isAuthenticated) {
      const inClass = user.classes.reduce((acc, item) => acc || item.class_id === Number(classId), false);

      if (!inClass) {
        history.push('/notFound');
      }
    }

    if (user.classes.length !== 0 && user.classes[0].course_id === undefined) {
      history.go(0);
    }
  }, [auth.isAuthenticated, classId, history, user.classes]);

  useEffect(() => {
    if (!courseId || !classId) {
      history.push(`/my-class/${user.classes[0].course_id}/${user.classes[0].class_id}/challenge`);
    }
  });

  useEffect(() => {
    if (classId && courseId) {
      dispatch(fetchClass(authToken, classId));
      dispatch(fetchCourse(authToken, courseId));
    }
  }, [authToken, classId, courseId, dispatch]);

  return (
    <Switch>
      <Route path="/my-class/:courseId/:classId/challenge/:challengeId" component={Challenge} />
      <Route exact path="/my-class/:courseId/:classId/challenge" component={ChallengeList} />
      <Route path="/my-class/:courseId/:classId/submission" component={Submission} />
      <Route path="/my-class/:courseId/:classId/grade" component={Grade} />
      <Route path="/my-class/:courseId/:classId/team" component={Team} />
      <Route path="/my-class/:courseId/:classId/member" component={Member} />
      <Route component={NoMatch} />
    </Switch>
  );
}
