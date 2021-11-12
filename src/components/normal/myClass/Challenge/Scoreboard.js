import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useParams } from 'react-router-dom';
import ScoreboardInfo from './ScoreboardSettings/ScoreboardInfo';
import NoMatch from '../../../noMatch';

export default function Scoreboard() {
  const {
    courseId, classId, challengeId, scoreboardId,
  } = useParams();
  const dispatch = useDispatch();

  const commonLoading = useSelector((state) => state.loading.common);
  const classes = useSelector((state) => state.classes.byId);
  const courses = useSelector((state) => state.courses.byId);
  const challenges = useSelector((state) => state.challenges.byId);
  const scoreboards = useSelector((state) => state.peerReviews.byId);

  // const dispatch = useDispatch();
  // if (
  //   challenges[challengeId] === undefined
  //   || courses[courseId] === undefined
  //   || classes[classId] === undefined
  //   || scoreboards[scoreboardId] === undefined
  // ) {
  //   if (commonLoading.fetchCourse || commonLoading.fetchClass || commonLoading.fetchChallenge) {
  //     return <GeneralLoading />;
  //   }
  //   return <NoMatch />;
  // }

  return (
    <>
      <Switch>
        <Route
          exact
          path="/my-class/:courseId/:classId/challenge/:challengeId/scoreboard/:scoreboardId"
          component={ScoreboardInfo}
        />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
