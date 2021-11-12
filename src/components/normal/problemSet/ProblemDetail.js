import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, makeStyles } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { readProblemInfo } from '../../../actions/myClass/problem';
import GeneralLoading from '../../GeneralLoading';
import NoMatch from '../../noMatch';
import Icon from '../../ui/icon';
import PageTitle from '../../ui/PageTitle';
import CodingProblemInfo from '../../ui/templates/CodingProblemInfo';

const useStyles = makeStyles(() => ({
  generalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

/* This is a level 4 component (page component) */
export default function ProblemDetail() {
  const {
    courseId, classId, challengeId, problemId,
  } = useParams();
  const classNames = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const baseURL = '/problem-set';

  const challenges = useSelector((state) => state.challenges.byId);
  const problems = useSelector((state) => state.problem.byId);
  const authToken = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.loading.myClass.problem);
  const commonLoading = useSelector((state) => state.loading.common);

  useEffect(() => {
    dispatch(readProblemInfo(authToken, problemId));
  }, [authToken, dispatch, problemId]);

  if (loading.readProblem) {
    return <GeneralLoading />;
  }

  if (problems[problemId] === undefined || challenges[challengeId] === undefined) {
    if (commonLoading.fetchCourse || commonLoading.fetchClass) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle
        text={`${challenges[challengeId] === undefined ? '' : challenges[challengeId].title} / ${
          problems[problemId] === undefined ? '' : problems[problemId].challenge_label
        }`}
      />
      <div className={classNames.generalButtons}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => history.push(`${baseURL}/${courseId}/${classId}/challenge/${challengeId}/${problemId}/my-submission`)}
          startIcon={<Icon.HistoryIcon />}
        >
          My Submission
        </Button>
        <Button
          color="primary"
          onClick={() => history.push(`${baseURL}/${courseId}/${classId}/challenge/${challengeId}/${problemId}/code-submission`)}
        >
          Submit
        </Button>
      </div>
      <CodingProblemInfo />
    </>
  );
}
