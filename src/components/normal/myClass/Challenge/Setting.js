import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, makeStyles,
} from '@material-ui/core';
import moment from 'moment';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useHistory, useParams } from 'react-router-dom';

import AlignedText from '../../../ui/AlignedText';
import SimpleBar from '../../../ui/SimpleBar';
import PageTitle from '../../../ui/PageTitle';
import { deleteChallenge } from '../../../../actions/myClass/challenge';
import NoMatch from '../../../noMatch';
import SettingEdit from './SettingEdit';
import GeneralLoading from '../../../GeneralLoading';

const useStyles = makeStyles(() => ({
  duration: {
    transform: 'translateY(-3px)',
  },
}));

/* This is a level 4 component (page component) */
export default function Setting() {
  const classes = useStyles();
  const { courseId, classId, challengeId } = useParams();
  const history = useHistory();

  const dispatch = useDispatch();

  const authToken = useSelector((state) => state.auth.token);
  const userClasses = useSelector((state) => state.classes.byId);
  const userCourses = useSelector((state) => state.courses.byId);
  const challenges = useSelector((state) => state.challenges.byId);
  const loading = useSelector((state) => state.loading.myClass.challenge.fetchChallenges);

  const [challenge, setChallenge] = useState(undefined);
  const [classTitle, setClassTitle] = useState('');

  useEffect(() => {
    setChallenge(challenges[challengeId]);
  }, [challenge, challenges, challengeId]);

  useEffect(() => {
    if (userClasses[classId] !== undefined && userCourses[courseId] !== undefined) {
      setClassTitle(`${userCourses[courseId].name} ${userClasses[classId].name}`);
    }
  }, [userClasses, classId, userCourses, courseId]);

  const [edit, setEdit] = useState(false);
  const [warningPopUp, setWarningPopUp] = useState(false);

  const handleDelete = () => {
    dispatch(deleteChallenge(authToken, challengeId));
    history.push(`/my-class/${courseId}/${classId}/challenge`);
  };

  if (challenge === undefined) {
    if (loading) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle text={`${challenge.title} / Setting`} />
      {edit ? (
        <SettingEdit challengeId={challengeId} challenge={challenge} setEdit={setEdit} />
      ) : (
        <>
          <Button onClick={() => setEdit(true)}>Edit</Button>

          <SimpleBar title="Information">
            <AlignedText text="Title" maxWidth="lg" childrenType="text">
              <Typography variant="body1">{challenge.title}</Typography>
            </AlignedText>
            <AlignedText text="Duration" maxWidth="lg" childrenType="text">
              <Typography variant="body1" className={classes.duration}>
                {moment(challenge.start_time).format('YYYY/MM/DD HH:mm')}
                <ArrowRightIcon style={{ transform: 'translate(0, 5px)' }} />
                {moment(challenge.end_time).format('YYYY/MM/DD HH:mm')}
              </Typography>
            </AlignedText>
            <AlignedText text="Scored by" maxWidth="lg" childrenType="text">
              <Typography variant="body1">
                {challenge.selection_type === 'LAST' ? 'Last Score' : 'Best Score'}
              </Typography>
            </AlignedText>
            <AlignedText text="Shown in Problem Set" maxWidth="lg" childrenType="text">
              <Typography variant="body1">
                {challenge.publicize_type === 'START_TIME' ? 'On Start Time' : 'On End Time'}
              </Typography>
            </AlignedText>
          </SimpleBar>

          <SimpleBar
            title="Delete Challenge"
            childrenButtons={(
              <>
                <Button color="secondary" onClick={() => setWarningPopUp(true)}>
                  Delete
                </Button>
              </>
            )}
          >
            <Typography variant="body1">
              Once you delete a challenge, there is no going back. Please be certain.
            </Typography>
          </SimpleBar>
        </>
      )}
      <Dialog open={warningPopUp} onClose={() => setWarningPopUp(false)} fullWidth>
        <DialogTitle id="dialog-slide-title">
          <Typography variant="h4">Delete Challenge</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Class" maxWidth="lg" childrenType="text" textColor="secondary">
            <Typography variant="body1">{classTitle}</Typography>
          </AlignedText>
          <AlignedText text="Title" maxWidth="lg" childrenType="text" textColor="secondary">
            <Typography variant="body1">{challenge.title}</Typography>
          </AlignedText>
          <Typography variant="body2">
            Once you delete a challenge, there is no going back. Please be certain.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="default" onClick={() => setWarningPopUp(false)}>
            Cancel
          </Button>
          <Button color="secondary" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
