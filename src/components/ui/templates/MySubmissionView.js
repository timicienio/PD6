import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Snackbar } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import AlignedText from '../AlignedText';
import AutoTable from '../AutoTable';
import SimpleBar from '../SimpleBar';
import PageTitle from '../PageTitle';
import {
  viewMySubmissionUnderProblem,
  readProblemInfo,
  readProblemScore,
  readProblemBestScore,
} from '../../../actions/myClass/problem';
import GeneralLoading from '../../GeneralLoading';
import NoMatch from '../../noMatch';

/* This is a level 4 component (page component) */
export default function MySubmission({ baseUrl, isProblemSet }) {
  const {
    courseId, classId, challengeId, problemId,
  } = useParams();

  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const accountId = useSelector((state) => state.user.id);
  const problems = useSelector((state) => state.problem);
  const challenges = useSelector((state) => state.challenges);
  const submissions = useSelector((state) => state.submissions);
  const judgments = useSelector((state) => state.judgments);
  const loading = useSelector((state) => state.loading.myClass.problem);
  const error = useSelector((state) => state.error.myClass.problem);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (!loading.submitCode && error.submitCode) {
      setShowSnackbar(true);
    } else setShowSnackbar(false);
  }, [error.submitCode, loading.submitCode]);

  useEffect(() => {
    dispatch(readProblemInfo(authToken, problemId));
  }, [authToken, dispatch, problemId]);

  if (challenges.byId[challengeId] === undefined || problems.byId[problemId] === undefined) {
    if (loading.viewMySubmissionUnderProblem || loading.readProblem || loading.readChallenge) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle
        text={`${challenges.byId[challengeId].title} / ${problems.byId[problemId].challenge_label} / My Submission`}
      />
      <SimpleBar title="Submission Information">
        <AlignedText
          text={
            isProblemSet
              ? 'My Best Score'
              : `My ${
                challenges.byId[challengeId].selection_type
                  ? challenges.byId[challengeId].selection_type[0].concat(
                    challenges.byId[challengeId].selection_type.slice(1).toLowerCase(),
                  )
                  : ''
              } Score`
          }
          childrenType="text"
        >
          <Typography variant="body1">{problems.byId[problemId].score?.toString() ?? 0}</Typography>
        </AlignedText>
      </SimpleBar>
      <AutoTable
        ident={`${baseUrl} submission table ${problemId}`}
        hasRefreshButton
        refreshLoadings={[loading.submitCode, loading.rejudgeSubmission]}
        hasFilter
        filterConfig={[
          {
            reduxStateId: 'submission_id',
            label: 'Submission ID',
            type: 'TEXT',
            operation: '=',
          },
        ]}
        defaultSort={['submit_time', 'DESC']}
        refetch={(browseParams, ident) => {
          dispatch(viewMySubmissionUnderProblem(authToken, accountId, problemId, browseParams, ident));
          if (isProblemSet) {
            dispatch(readProblemBestScore(authToken, problemId));
          } else {
            dispatch(readProblemScore(authToken, problemId));
          }
        }}
        refetchErrors={[error.viewMySubmissionUnderProblem]}
        columns={[
          {
            name: 'Submission ID',
            align: 'center',
            type: 'string',
          },
          {
            name: 'Status',
            align: 'center',
            type: 'string',
            colors: {
              'Waiting for judge': 'default',
              'No Status': 'error',
              Accepted: 'accepted',
              'Wrong Answer': 'error',
              'Memory Limit Exceed': 'error',
              'Time Limit Exceed': 'error',
              'Runtime Error': 'error',
              'Compile Error': 'error',
              'Contact Manager': 'error',
              'Forbidden Action': 'error',
              'System Error': 'error',
            },
          },
          {
            name: 'Score',
            align: 'center',
            type: 'string',
          },
          {
            name: 'Used Time (ms)',
            align: 'center',
            type: 'string',
          },
          {
            name: 'Used Memory (kb)',
            align: 'center',
            type: 'string',
          },
          {
            name: 'Submit Time',
            align: 'center',
            type: 'string',
            sortable: 'submit_time',
          },
        ]}
        reduxData={submissions}
        reduxDataToRows={(item) => ({
          id: item.id,
          'Submission ID': item.id,
          Status: item.verdict === null ? 'Waiting For Judge' : item.verdict,
          Score:
            item.latestJudgmentId !== null && judgments.byId[item.latestJudgmentId] !== undefined
              ? judgments.byId[item.latestJudgmentId].score
              : '',
          'Used Time (ms)':
            item.latestJudgmentId !== null && judgments.byId[item.latestJudgmentId] !== undefined
              ? judgments.byId[item.latestJudgmentId].total_time
              : '',
          'Used Memory (kb)':
            item.latestJudgmentId !== null && judgments.byId[item.latestJudgmentId] !== undefined
              ? judgments.byId[item.latestJudgmentId].max_memory
              : '',
          'Submit Time': moment(item.submit_time).format('YYYY-MM-DD, HH:mm'),
          link: `${baseUrl}/${courseId}/${classId}/challenge/${challengeId}/${problemId}/my-submission/${item.id}`,
        })}
        hasLink
      />
      <Snackbar
        message="Error: code submission failed"
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
      />
    </>
  );
}
