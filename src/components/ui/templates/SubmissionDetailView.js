import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography, Button, makeStyles, Dialog, DialogTitle, DialogActions, DialogContent,
} from '@material-ui/core';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import Icon from '../icon/index';
import SimpleBar from '../SimpleBar';
import AlignedText from '../AlignedText';
import SimpleTable from '../SimpleTable';
import PageTitle from '../PageTitle';
import GeneralLoading from '../../GeneralLoading';
import { browseTestcases, rejudgeSubmission } from '../../../actions/myClass/problem';
import { browseAllJudgementJudgeCase } from '../../../actions/api/judgement';
import { readSubmissionDetail, fetchSubmission } from '../../../actions/myClass/submission';
import { browseSubmitLang } from '../../../actions/common/common';
import NoMatch from '../../noMatch';
import CodeArea from '../CodeArea';

const useStyles = makeStyles((theme) => ({
  textLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.hover,
    },
    '&:active': {
      color: theme.palette.primary.dark,
    },
  },
  generalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  codeField: {
    width: '50vw',
  },
}));

/* This is a level 4 component (page component) */
export default function SubmissionDetail({ baseUrl, isManager, isProblemSet }) {
  const {
    courseId, classId, challengeId, problemId, submissionId,
  } = useParams();
  const classNames = useStyles();
  const [popUp, setPopUp] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [judgmentId, setJudgmentId] = useState('');
  const [testcaseDataIds, setTestcaseDataIds] = useState([]);
  const [sampleDataIds, setSampleDataIds] = useState([]);
  const dispatch = useDispatch();

  const submissions = useSelector((state) => state.submissions.byId);
  const judgments = useSelector((state) => state.judgments);
  const challenges = useSelector((state) => state.challenges);
  const problems = useSelector((state) => state.problem);
  const user = useSelector((state) => state.user);
  const judgeCases = useSelector((state) => state.judgeCases);
  const testcases = useSelector((state) => state.testcases);
  const submitLangs = useSelector((state) => state.submitLangs.byId);
  const authToken = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.loading.myClass.problem);
  const [rejudge, setRejudge] = useState(false);

  useEffect(() => {
    dispatch(readSubmissionDetail(authToken, submissionId));
    dispatch(fetchSubmission(authToken, submissionId));
  }, [authToken, challengeId, dispatch, problemId, submissionId]);

  useEffect(() => {
    if (rejudge === false) {
      setJudgmentId(judgments.allIds.filter((id) => judgments.byId[id].submission_id === Number(submissionId))[0]);
      if (judgments.allIds.filter((id) => judgments.byId[id].submission_id === Number(submissionId))[0]) {
        dispatch(
          browseAllJudgementJudgeCase(
            authToken,
            judgments.allIds.filter((id) => judgments.byId[id].submission_id === Number(submissionId))[0],
          ),
        );
      }
    } else {
      setJudgmentId(
        judgments.allIds
          .reduce((acc, b) => [b, ...acc], [])
          .filter((id) => judgments.byId[id].submission_id === Number(submissionId))[0],
      );
      if (
        judgments.allIds
          .reduce((acc, b) => [b, ...acc], [])
          .filter((id) => judgments.byId[id].submission_id === Number(submissionId))[0]
      ) {
        dispatch(
          browseAllJudgementJudgeCase(
            authToken,
            judgments.allIds.filter((id) => judgments.byId[id].submission_id === Number(submissionId))[0],
          ),
        );
      }
    }
  }, [authToken, dispatch, judgments.allIds, judgments.byId, rejudge, submissionId]);

  useEffect(() => {
    dispatch(browseTestcases(authToken, problemId));
  }, [authToken, dispatch, problemId]);

  useEffect(() => {
    dispatch(browseSubmitLang(authToken));
  }, [authToken, dispatch]);

  const transformSample = useCallback(
    (id) => {
      if (testcases.byId[id].input_filename !== null) {
        return testcases.byId[id].input_filename.slice(6, testcases.byId[id].input_filename.indexOf('.'));
      }
      if (testcases.byId[id].output_filename !== null) {
        return testcases.byId[id].output_filename.slice(6, testcases.byId[id].output_filename.indexOf('.'));
      }
      return 0;
    },
    [testcases],
  );

  const transformTestcase = useCallback(
    (id) => {
      if (testcases.byId[id].input_filename !== null) {
        return testcases.byId[id].input_filename.slice(0, testcases.byId[id].input_filename.indexOf('.'));
      }
      if (testcases.byId[id].output_filename !== null) {
        return testcases.byId[id].output_filename.slice(0, testcases.byId[id].output_filename.indexOf('.'));
      }
      return 0;
    },
    [testcases],
  );

  useEffect(() => {
    if (problems.byId[problemId] && problems.byId[problemId].testcaseIds) {
      const testcasesId = problems.byId[problemId].testcaseIds.filter(
        (id) => !testcases.byId[id].is_sample && !testcases.byId[id].is_deleted,
      );
      const samplesId = problems.byId[problemId].testcaseIds.filter(
        (id) => testcases.byId[id].is_sample && !testcases.byId[id].is_deleted,
      );
      testcasesId.sort((a, b) => transformTestcase(a).localeCompare(transformTestcase(b)));
      samplesId.sort((a, b) => transformSample(a).localeCompare(transformSample(b)));
      setSampleDataIds(samplesId);
      setTestcaseDataIds(testcasesId);
    }
  }, [problems, problemId, transformTestcase, transformSample, testcases]);

  useEffect(() => {
    if (sampleDataIds && testcaseDataIds && judgeCases.allIds) {
      setTableData(
        []
          .concat(sampleDataIds)
          .concat(testcaseDataIds)
          .map((id) => ({
            id,
            no: transformTestcase(id),
            time: judgeCases.byId[`${submissions[submissionId]?.latestJudgmentId}-${id}`]
              ? judgeCases.byId[`${submissions[submissionId]?.latestJudgmentId}-${id}`].time_lapse
              : '',
            memory: judgeCases.byId[`${submissions[submissionId]?.latestJudgmentId}-${id}`]
              ? judgeCases.byId[`${submissions[submissionId]?.latestJudgmentId}-${id}`].peak_memory
              : '',
            status: judgeCases.byId[`${submissions[submissionId]?.latestJudgmentId}-${id}`]
              ? judgeCases.byId[`${submissions[submissionId]?.latestJudgmentId}-${id}`].verdict
              : '',
            score: judgeCases.byId[`${submissions[submissionId]?.latestJudgmentId}-${id}`]
              ? judgeCases.byId[`${submissions[submissionId]?.latestJudgmentId}-${id}`].score
              : '',
          }))
          .sort((a, b) => {
            if (!a.no.includes('sample') && b.no.includes('sample')) return 1;
            if (a.no.includes('sample') && !b.no.includes('sample')) return -1;
            if (
              a.no.includes('sample')
              && b.no.includes('sample')
              && Number(a.no.substring(6)) > Number(b.no.substring(6))
            ) return 1;
            if (
              a.no.includes('sample')
              && b.no.includes('sample')
              && Number(a.no.substring(6)) < Number(b.no.substring(6))
            ) return -1;
            if (!a.no.includes('sample') && !b.no.includes('sample') && Number(a.no) > Number(b.no)) return 1;
            if (!a.no.includes('sample') && !b.no.includes('sample') && Number(a.no) < Number(b.no)) return -1;
            return 0;
          }),
      );
    }
  }, [
    judgeCases.allIds,
    judgeCases.byId,
    judgmentId,
    sampleDataIds,
    submissionId,
    submissions,
    testcaseDataIds,
    transformTestcase,
  ]);

  if (
    problems.byId[problemId] === undefined
    || challenges.byId[challengeId] === undefined
    || submissions[submissionId] === undefined
    || judgments === undefined
    || judgeCases.allIds === undefined
    || testcases.allIds === undefined
  ) {
    if (loading.readSubmissionDetail || loading.browseJudgeCases || loading.readTestcase || loading.rejudgeSubmission) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  const handleRefresh = () => {
    dispatch(readSubmissionDetail(authToken, submissionId));
    dispatch(fetchSubmission(authToken, submissionId));
  };

  const handleRejudge = () => {
    setRejudge(true);
    dispatch(rejudgeSubmission(authToken, submissionId));
    setPopUp(false);
  };

  return (
    <>
      <PageTitle text={`${submissionId} / Submission Detail`} />
      <div className={classNames.generalButtons}>
        {isManager && !isProblemSet && (
          <Button
            onClick={() => {
              setPopUp(true);
            }}
          >
            Rejudge
          </Button>
        )}
        <Button color="primary" startIcon={<Icon.RefreshOutlinedIcon />} onClick={handleRefresh}>
          Refresh
        </Button>
      </div>
      <SimpleBar title="Submission Information">
        <AlignedText text="Submission ID" childrenType="text">
          <Typography variant="body1">{submissionId}</Typography>
        </AlignedText>
        <AlignedText text="Username" childrenType="text">
          <Link to={`/user-profile/${user.id}`} className={classNames.textLink}>
            <Typography variant="body1">{user.username}</Typography>
          </Link>
        </AlignedText>
        <AlignedText text="Student ID" childrenType="text">
          <Typography variant="body1">{user.student_id}</Typography>
        </AlignedText>
        <AlignedText text="Real Name" childrenType="text">
          <Typography variant="body1">{user.real_name}</Typography>
        </AlignedText>
        <AlignedText text="Challenge" childrenType="text">
          <Link to={`${baseUrl}/${courseId}/${classId}/challenge/${challengeId}`} className={classNames.textLink}>
            <Typography variant="body1">{challenges.byId[challengeId].title}</Typography>
          </Link>
        </AlignedText>
        <AlignedText text="Task Label" childrenType="text">
          <Link
            to={`${baseUrl}/${courseId}/${classId}/challenge/${challengeId}/${problemId}`}
            className={classNames.textLink}
          >
            <Typography variant="body1">{problems.byId[problemId].challenge_label}</Typography>
          </Link>
        </AlignedText>
        <AlignedText text="Task Title" childrenType="text">
          <Typography variant="body1">{problems.byId[problemId].title}</Typography>
        </AlignedText>
        <AlignedText text="Status" childrenType="text">
          {judgments.byId[judgmentId] ? (
            <div>
              {judgments.byId[judgmentId].verdict === 'Accepted' ? (
                <Typography variant="body1" color="primary">
                  {judgments.byId[judgmentId].verdict}
                </Typography>
              ) : (
                <Typography variant="body1" color="secondary">
                  {judgments.byId[judgmentId].verdict}
                </Typography>
              )}
            </div>
          ) : (
            <Typography variant="body1">Waiting for judge</Typography>
          )}
        </AlignedText>
        <AlignedText text="Score" childrenType="text">
          {judgments.byId[judgmentId] && (
            <div>
              <Typography variant="body1">{judgments.byId[judgmentId].score}</Typography>
            </div>
          )}
        </AlignedText>
        <AlignedText text="Submit Time" childrenType="text">
          <Typography variant="body1">
            {moment(submissions[submissionId].submit_time).format('YYYY-MM-DD, HH:mm')}
          </Typography>
        </AlignedText>
        <AlignedText text="Language" childrenType="text">
          {submitLangs[submissions[submissionId].language_id] && (
            <Typography variant="body1">
              {`${submitLangs[submissions[submissionId].language_id].name} ${
                submitLangs[submissions[submissionId].language_id].version
              }`}
            </Typography>
          )}
        </AlignedText>
      </SimpleBar>
      <SimpleBar title="Submission Result" noIndent>
        <SimpleTable
          isEdit={false}
          hasDelete={false}
          columns={[
            {
              id: 'no',
              label: 'No.',
              minWidth: 30,
              align: 'center',
              width: 400,
              type: 'string',
            },
            {
              id: 'time',
              label: 'Time (ms)',
              minWidth: 50,
              align: 'center',
              width: 600,
              type: 'string',
            },
            {
              id: 'memory',
              label: 'Memory (kb)',
              minWidth: 50,
              align: 'center',
              width: 600,
              type: 'string',
            },
            {
              id: 'status',
              label: 'Status',
              minWidth: 50,
              align: 'center',
              width: 600,
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
      <SimpleBar title="Code" noIndent>
        <CodeArea value={submissions[submissionId].content} />
      </SimpleBar>
      <Dialog
        maxWidth="md"
        open={popUp}
        onClose={() => {
          setPopUp(false);
        }}
      >
        <DialogTitle>
          <Typography variant="h4">Rejudge Submission</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Submission ID" childrenType="text">
            <Typography variant="body1">{submissionId}</Typography>
          </AlignedText>
          <Typography variant="body2">
            Once you rejudge a submission, the corresponding score and status may change.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setPopUp(false);
            }}
          >
            Cancel
          </Button>
          <Button color="secondary" onClick={handleRejudge}>
            Rejudge
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
