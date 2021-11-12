import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography, Button, makeStyles, Dialog, DialogTitle, DialogActions, DialogContent,
} from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import Icon from '../../../ui/icon/index';
import AlignedText from '../../../ui/AlignedText';
import PageTitle from '../../../ui/PageTitle';

import CodingProblemInfo from './ProblemSettings/CodingProblemInfo';
import CodingProblemEdit from './ProblemSettings/CodingProblemEdit';
import NoMatch from '../../../noMatch';
import GeneralLoading from '../../../GeneralLoading';

import { readProblemWithJudgeCode, rejudgeProblem } from '../../../../actions/myClass/problem';

const useStyles = makeStyles(() => ({
  sampleArea: {
    marginTop: '50px',
  },
  generalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  managerButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

/* This is a level 4 component (page component) */
/* TODO: Judge whether it is project type. */
export default function CodingProblem() {
  const {
    courseId, classId, challengeId, problemId,
  } = useParams();
  const history = useHistory();
  const classNames = useStyles();

  const dispatch = useDispatch();

  const classes = useSelector((state) => state.classes.byId);
  const courses = useSelector((state) => state.courses.byId);
  const userClasses = useSelector((state) => state.user.classes);
  const problems = useSelector((state) => state.problem.byId);
  const challenges = useSelector((state) => state.challenges.byId);
  const authToken = useSelector((state) => state.auth.token);
  //  const error = useSelector((state) => state.error.myClass.problem);
  const commonLoading = useSelector((state) => state.loading.common);
  const [role, setRole] = useState('NORMAL');

  const [edit, setEdit] = useState(false);
  const [rejudgePopUp, setRejudgePopUp] = useState(false);

  const handleCloseEdit = () => {
    setEdit(false);
  };

  const handleRejudge = () => {
    dispatch(rejudgeProblem(authToken, problemId));
    setRejudgePopUp(false);
  };

  // console.log(userClasses);
  useEffect(() => {
    if (userClasses.filter((item) => item.class_id === Number(classId)).length !== 0) {
      setRole(userClasses.filter((item) => item.class_id === Number(classId))[0].role);
    }
  }, [classId, userClasses]);

  useEffect(() => {
    dispatch(readProblemWithJudgeCode(authToken, problemId));
  }, [authToken, dispatch, problemId]);

  useEffect(() => {
    setEdit(false);
  }, [problemId]);

  if (
    problems[problemId] === undefined
    || challenges[challengeId] === undefined
    || courses[courseId] === undefined
    || classes[classId] === undefined
  ) {
    if (commonLoading.fetchCourse || commonLoading.fetchClass) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle
        text={`${challenges[challengeId] === undefined ? 'error' : challenges[challengeId].title} / ${
          problems[problemId] === undefined ? 'error' : problems[problemId].challenge_label
        }`}
      />
      {!edit && role === 'MANAGER' ? (
        <div>
          <div className={classNames.managerButtons}>
            <div>
              <Button color="default" onClick={() => setEdit(true)}>
                Edit
              </Button>
              <Button color="default" onClick={() => setRejudgePopUp(true)}>
                Rejudge
              </Button>
            </div>
            <div>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => history.push(`/my-class/${courseId}/${classId}/challenge/${challengeId}/${problemId}/my-submission`)}
                startIcon={<Icon.HistoryIcon />}
              >
                My Submission
              </Button>
              <Button
                color="primary"
                onClick={() => history.push(`/my-class/${courseId}/${classId}/challenge/${challengeId}/${problemId}/code-submission`)}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      ) : (
        !edit && (
          <div className={classNames.generalButtons}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => history.push(`/my-class/${courseId}/${classId}/challenge/${challengeId}/${problemId}/my-submission`)}
              startIcon={<Icon.HistoryIcon />}
            >
              My Submission
            </Button>
            <Button
              color="primary"
              onClick={() => history.push(`/my-class/${courseId}/${classId}/challenge/${challengeId}/${problemId}/code-submission`)}
            >
              Submit
            </Button>
          </div>
        )
      )}
      {edit ? <CodingProblemEdit closeEdit={handleCloseEdit} role={role} /> : <CodingProblemInfo role={role} />}
      <Dialog open={rejudgePopUp} onClose={() => setRejudgePopUp(false)} maxWidth="md">
        <DialogTitle>
          <Typography variant="h4">Rejudge Problem</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Class" childrenType="text">
            <Typography>{`${courses[courseId].name} ${classes[classId].name}`}</Typography>
          </AlignedText>
          <AlignedText text="Title" childrenType="text">
            <Typography>{problems[problemId] === undefined ? 'error' : problems[problemId].title}</Typography>
          </AlignedText>
          <AlignedText text="Label" childrenType="text">
            <Typography>{problems[problemId] === undefined ? 'error' : problems[problemId].challenge_label}</Typography>
          </AlignedText>
          <Typography variant="body2" color="textPrimary">
            Once you rejudge a problem, all related submissions will be judged again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejudgePopUp(false)}>Cancel</Button>
          <Button color="secondary" onClick={handleRejudge}>
            Rejudge
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
