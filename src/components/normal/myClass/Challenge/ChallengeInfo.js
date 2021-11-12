import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import {
  Typography, Button, makeStyles, TextField,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { MathpixMarkdown, MathpixLoader } from 'mathpix-markdown-it';
import NoMatch from '../../../noMatch';
import AlignedText from '../../../ui/AlignedText';
import SimpleBar from '../../../ui/SimpleBar';
import SimpleTable from '../../../ui/SimpleTable';
import PageTitle from '../../../ui/PageTitle';
import { readProblemScore } from '../../../../actions/myClass/problem';
import { editChallenge } from '../../../../actions/myClass/challenge';
import { fetchChallenge } from '../../../../actions/common/common';
import GeneralLoading from '../../../GeneralLoading';

const useStyles = makeStyles(() => ({
  descriptionField: {
    width: '60vw',
  },
  table: {
    width: '100%',
  },
}));

/* This is a level 4 component (page component) */
export default function ChallengeInfo() {
  const { classId, challengeId } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [currentTime] = useState(moment());
  const [status, setStatus] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [inputs, setInputs] = useState('');
  const [tableData, setTableData] = useState([]);

  const authToken = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.loading.myClass.challenge);
  const commonLoading = useSelector((state) => state.loading.common.common);
  const userClasses = useSelector((state) => state.user.classes);
  const challenges = useSelector((state) => state.challenges.byId);
  const problems = useSelector((state) => state.problem.byId);
  const essays = useSelector((state) => state.essays.byId);
  const peerReviews = useSelector((state) => state.peerReviews.byId);

  const [hasRequest, setHasRequest] = useState(false);
  const [hasInit, setHasInit] = useState(false);

  useEffect(() => {
    if (hasRequest && !loading.editChallenge) {
      dispatch(fetchChallenge(authToken, challengeId));
      setHasRequest(false);
    }
  }, [authToken, challengeId, dispatch, hasRequest, loading.editChallenge]);

  useEffect(() => {
    if (!hasInit && challenges[challengeId]) {
      challenges[challengeId].problemIds.map((id) => dispatch(readProblemScore(authToken, id)));
      setHasInit(true);
    }
  }, [authToken, challengeId, challenges, dispatch, hasInit]);

  useEffect(() => {
    if (challenges[challengeId]) {
      if (currentTime.isBefore(moment(challenges[challengeId].start_time))) {
        setStatus('Not Yet');
      } else if (currentTime.isBefore(moment(challenges[challengeId].end_time))) {
        setStatus('Opened');
      } else {
        setStatus('Closed');
      }
      setInputs(challenges[challengeId].description);
    }
  }, [challengeId, challenges, currentTime]);

  useEffect(() => {
    if (userClasses.filter((item) => item.class_id === Number(classId))[0].role === 'MANAGER') {
      setIsManager(true);
    }
  }, [classId, userClasses]);

  useEffect(() => {
    if (challenges[challengeId]) {
      if (challenges[challengeId].problemIds.reduce((acc, item) => acc && problems[item] !== undefined, true)) {
        // problems are complete
        setTableData(
          challenges[challengeId].problemIds
            .map((id) => ({
              challenge_label: problems[id].challenge_label,
              score: problems[id].score,
              id: `coding-${id}`,
            }))
            .concat(
              challenges[challengeId].essayIds.map((id) => ({
                challenge_label: essays[id].challenge_label,
                id: `essay-${id}`,
              })),
              challenges[challengeId].peerReviewIds.map((id) => ({
                challenge_label: peerReviews[id].challenge_label,
                id: `peer-${id}`,
              })),
            ),
        );
      }
    }
  }, [authToken, challengeId, challenges, essays, peerReviews, problems]);

  if (challenges[challengeId] === undefined) {
    if (commonLoading.fetchChallenge) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setInputs(challenges[challengeId].description);
  };

  const handleSave = () => {
    const body = {
      description: inputs,
    };
    dispatch(editChallenge(authToken, challengeId, body));
    setHasRequest(true);
    setEditMode(false);
    setInputs(challenges[challengeId].description);
  };

  return (
    <>
      <PageTitle text={`${challenges[challengeId].title} / Info`} />
      <SimpleBar
        title="Description"
        buttons={<>{isManager && !editMode && <Button onClick={handleEdit}>Edit</Button>}</>}
      >
        {editMode ? (
          <div>
            <TextField
              placeholder="(Text, LaTeX, Markdown and HTML supported)"
              className={classes.descriptionField}
              value={inputs}
              onChange={(e) => setInputs(e.target.value)}
              multiline
              minRows={10}
              maxRows={10}
              variant="outlined"
            />
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </div>
        ) : (
          <MathpixLoader>
            <MathpixMarkdown text={challenges[challengeId].description} htmlTags />
          </MathpixLoader>
        )}
      </SimpleBar>
      <SimpleBar title="Challenge Information">
        <>
          <AlignedText text="Scored by" childrenType="text">
            <Typography variant="body1">
              {challenges[challengeId].selection_type === 'LAST' ? 'Last Score' : 'Best Score'}
            </Typography>
          </AlignedText>
          <AlignedText text="Status" childrenType="text">
            <Typography variant="body1">{status}</Typography>
          </AlignedText>
          <AlignedText text="Start time" childrenType="text">
            <Typography variant="body1">
              {moment(challenges[challengeId].start_time).format('YYYY-MM-DD, HH:mm')}
            </Typography>
          </AlignedText>
          <AlignedText text="End time" childrenType="text">
            <Typography variant="body1">
              {moment(challenges[challengeId].end_time).format('YYYY-MM-DD, HH:mm')}
            </Typography>
          </AlignedText>
        </>
      </SimpleBar>
      <SimpleBar title="Overview" noIndent>
        <SimpleTable
          className={classes.table}
          isEdit={false}
          hasDelete={false}
          columns={[
            {
              id: 'challenge_label',
              label: 'Label',
              minWidth: 30,
              align: 'center',
              width: 300,
              type: 'string',
            },
            {
              id: 'score',
              label: 'Score',
              minWidth: 50,
              align: 'center',
              width: 600,
              type: 'string',
            },
          ]}
          data={tableData}
        />
      </SimpleBar>
    </>
  );
}
