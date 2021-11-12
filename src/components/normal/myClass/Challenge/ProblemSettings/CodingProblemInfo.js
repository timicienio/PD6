import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// https://mathpix.com/docs/mathpix-markdown/overview
// https://github.com/Mathpix/mathpix-markdown-it
import { MathpixMarkdown, MathpixLoader } from 'mathpix-markdown-it';
import {
  Typography,
  Button,
  makeStyles,
  withStyles,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import SimpleBar from '../../../../ui/SimpleBar';
import SimpleTable from '../../../../ui/SimpleTable';
import SampleTestArea from '../../../../ui/SampleTestArea';
import AlignedText from '../../../../ui/AlignedText';
import Icon from '../../../../ui/icon/index';
import CodeArea from '../../../../ui/CodeArea';

import NoMatch from '../../../../noMatch';
import GeneralLoading from '../../../../GeneralLoading';

import {
  browseTestcase,
  browseAssistingData,
  deleteProblem,
  downloadAllSamples,
  downloadAllTestcases,
} from '../../../../../actions/myClass/problem';

import { downloadFile } from '../../../../../actions/common/common';

const useStyles = makeStyles(() => ({
  sampleArea: {
    marginTop: '50px',
  },
  sampleName: {
    marginBottom: '16px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  table: {
    width: '100%',
  },
  content: {
    whiteSpace: 'pre-line',
  },
  statusSwitch: {
    marginTop: '20px',
  },
}));

const StyledButton = withStyles({
  outlined: {
    '& path': {
      fill: 'none !important',
    },
  },
})(Button);

/* This is a level 4 component (page component) */
export default function CodingProblemInfo({ role = 'NORMAL' }) {
  const {
    courseId, classId, challengeId, problemId,
  } = useParams();
  const history = useHistory();
  const classNames = useStyles();

  const dispatch = useDispatch();

  const classes = useSelector((state) => state.classes.byId);
  const courses = useSelector((state) => state.courses.byId);
  const problems = useSelector((state) => state.problem.byId);
  const testcases = useSelector((state) => state.testcases.byId);
  const [status, setStatus] = useState(true);

  const assistingData = useSelector((state) => state.assistingData.byId);

  const authToken = useSelector((state) => state.auth.token);
  // const error = useSelector((state) => state.error);
  const loading = useSelector((state) => state.loading.myClass.problem);

  const [sampleDataIds, setSampleDataIds] = useState([]);
  const [testcaseDataIds, setTestcaseDataIds] = useState([]);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [emailSentPopup, setEmailSentPopup] = useState(false);

  const handleDelete = () => {
    dispatch(deleteProblem(authToken, problemId));

    setDeletePopUp(false);
    history.push(`/my-class/${courseId}/${classId}/challenge/${challengeId}`);
  };

  const downloadAllAssistingFile = () => {
    const files = problems[problemId].assistingDataIds.map((id) => ({
      uuid: assistingData[id].s3_file_uuid,
      filename: assistingData[id].filename,
      as_attachment: false,
    }));
    files.map((file) => dispatch(downloadFile(authToken, file)));
  };

  const downloadAllSampleFile = () => {
    dispatch(downloadAllSamples(authToken, problemId, true));
    setEmailSentPopup(true);
  };

  const downloadAllTestingFile = () => {
    dispatch(downloadAllTestcases(authToken, problemId, true));
    setEmailSentPopup(true);
  };

  // parse filename to get sample number
  const sampleTransToNumber = useCallback(
    (id) => {
      if (testcases[id].input_filename !== null) {
        return Number(testcases[id].input_filename.slice(6, testcases[id].input_filename.indexOf('.')));
      }
      if (testcases[id].output_filename !== null) {
        return Number(testcases[id].output_filename.slice(6, testcases[id].output_filename.indexOf('.')));
      }
      return 0;
    },
    [testcases],
  );

  // parse filename to get testcase number
  const testcaseTransToNumber = useCallback(
    (id) => {
      if (testcases[id].input_filename !== null) {
        return Number(testcases[id].input_filename.slice(0, testcases[id].input_filename.indexOf('.')));
      }
      if (testcases[id].output_filename !== null) {
        return Number(testcases[id].output_filename.slice(0, testcases[id].output_filename.indexOf('.')));
      }
      return 0;
    },
    [testcases],
  );

  useEffect(() => {
    if (problems[problemId] && problems[problemId].testcaseIds) {
      const testcasesId = problems[problemId].testcaseIds.filter((id) => !testcases[id].is_sample);
      const samplesId = problems[problemId].testcaseIds.filter((id) => testcases[id].is_sample);
      testcasesId.sort((a, b) => testcaseTransToNumber(a) - testcaseTransToNumber(b));
      samplesId.sort((a, b) => sampleTransToNumber(a) - sampleTransToNumber(b));
      setSampleDataIds(samplesId);
      setTestcaseDataIds(testcasesId);
      if (testcasesId.length === 0) {
        setStatus(true);
      } else {
        setStatus(!testcases[testcasesId[0]].is_disabled);
      }
    }
  }, [problems, problemId, testcases, sampleTransToNumber, testcaseTransToNumber]);

  useEffect(() => {
    dispatch(browseTestcase(authToken, problemId));
  }, [authToken, dispatch, problemId]);

  useEffect(() => {
    if (role === 'MANAGER') {
      dispatch(browseAssistingData(authToken, problemId));
    }
  }, [authToken, dispatch, problemId, role]);

  if (loading.readProblem || loading.browseTestcase || loading.browseAssistingData || loading.readChallenge) {
    return <GeneralLoading />;
  }

  if (problems[problemId] === undefined || classes[classId] === undefined || courses[courseId] === undefined) {
    return <NoMatch />;
  }

  return (
    <>
      <SimpleBar title="Title">
        <Typography variant="body2">
          {problems[problemId] === undefined ? 'error' : problems[problemId].title}
        </Typography>
      </SimpleBar>
      <SimpleBar title="Description">
        <MathpixLoader>
          <MathpixMarkdown text={problems[problemId].description} htmlTags />
        </MathpixLoader>
      </SimpleBar>
      <SimpleBar title="About Input and Output">
        <MathpixLoader>
          <MathpixMarkdown text={problems[problemId].io_description} htmlTags />
        </MathpixLoader>
      </SimpleBar>
      {problems[problemId].source !== '' && (
        <SimpleBar title="Source">
          <Typography variant="body2">{problems[problemId].source}</Typography>
        </SimpleBar>
      )}
      {problems[problemId].hint !== '' && (
        <SimpleBar title="Hint">
          <Typography variant="body2">{problems[problemId].hint}</Typography>
        </SimpleBar>
      )}
      <SimpleBar title="Sample Data" noIndent>
        {role === 'MANAGER' && (
          <StyledButton
            variant="outlined"
            color="inherit"
            startIcon={<Icon.Download />}
            onClick={downloadAllSampleFile}
          >
            Download All Files
          </StyledButton>
        )}
        <SimpleTable
          className={classNames.table}
          isEdit={false}
          hasDelete={false}
          columns={[
            {
              id: 'no',
              label: 'No.',
              minWidth: 40,
              align: 'center',
              width: 50,
              type: 'string',
            },
            {
              id: 'time_limit',
              label: 'Max Time (ms)',
              minWidth: 50,
              align: 'center',
              width: 200,
              type: 'string',
            },
            {
              id: 'memory_limit',
              label: 'Max Memory (kb)',
              minWidth: 50,
              align: 'center',
              width: 200,
              type: 'string',
            },
          ]}
          data={sampleDataIds.map((id) => ({
            id,
            no: sampleTransToNumber(id),
            time_limit: testcases[id].time_limit,
            memory_limit: testcases[id].memory_limit,
            note: testcases[id].note,
          }))}
        />
        <div className={classNames.sampleArea}>
          <Grid container spacing={3}>
            {sampleDataIds.map((id) => (
              <Grid item xs={6} key={id}>
                <Typography variant="h6" className={classNames.sampleName}>
                  {`Sample ${sampleTransToNumber(id)}`}
                </Typography>
                <SampleTestArea input={testcases[id].input} output={testcases[id].output} note={testcases[id].note} />
              </Grid>
            ))}
          </Grid>
        </div>
      </SimpleBar>
      <SimpleBar
        noIndent
        title="Testing Data"
        buttons={
          role === 'MANAGER' && (
            <FormControlLabel
              control={<Switch checked={status} name="status" color="primary" disabled />}
              label={status ? 'Enabled' : 'Disabled'}
              className={classNames.statusSwitch}
            />
          )
        }
      >
        {role === 'MANAGER' && (
          <StyledButton
            variant="outlined"
            color="inherit"
            startIcon={<Icon.Download />}
            onClick={downloadAllTestingFile}
          >
            Download All Files
          </StyledButton>
        )}
        <SimpleTable
          className={classNames.table}
          isEdit={false}
          hasDelete={false}
          columns={[
            {
              id: 'no',
              label: 'No.',
              minWidth: 40,
              align: 'center',
              width: 50,
              type: 'string',
            },
            {
              id: 'time_limit',
              label: 'Max Time (ms)',
              minWidth: 50,
              align: 'center',
              width: 200,
              type: 'string',
            },
            {
              id: 'memory_limit',
              label: 'Max Memory (kb)',
              minWidth: 50,
              align: 'center',
              width: 200,
              type: 'string',
            },
            {
              id: 'score',
              label: 'Score',
              minWidth: 50,
              align: 'center',
              width: 100,
              type: 'string',
            },
            {
              id: 'note',
              label: 'Note',
              align: 'left',
              type: 'string',
            },
          ]}
          data={testcaseDataIds.map((id) => ({
            id,
            no: testcaseTransToNumber(id),
            time_limit: testcases[id].time_limit,
            memory_limit: testcases[id].memory_limit,
            score: testcases[id].score,
            note: testcases[id].note,
          }))}
        />
      </SimpleBar>
      {role === 'MANAGER' && (
        <SimpleBar title="Assisting Data (Optional)" noIndent>
          <StyledButton
            variant="outlined"
            color="inherit"
            startIcon={<Icon.Download />}
            onClick={downloadAllAssistingFile}
          >
            Download All Files
          </StyledButton>
          <SimpleTable
            className={classNames.table}
            isEdit={false}
            hasDelete={false}
            columns={[
              {
                id: 'filename',
                label: 'File Name',
                minWidth: 40,
                align: 'center',
                width: 200,
                type: 'string',
              },
            ]}
            data={
              problems[problemId] !== undefined
                ? problems[problemId].assistingDataIds.map((id) => ({
                  id,
                  filename: assistingData[id].filename,
                }))
                : []
            }
          />
        </SimpleBar>
      )}
      {role === 'MANAGER' && problems[problemId].judge_type === 'CUSTOMIZED' && (
        <SimpleBar
          title="Customize Judge Code (Optional)"
          noIndent
          buttons={(
            <FormControlLabel
              control={<Switch checked name="customizeJudge" color="primary" disabled />}
              label="Enabled"
              className={classNames.statusSwitch}
            />
          )}
        >
          <CodeArea value={problems[problemId].judge_source.judge_code} />
        </SimpleBar>
      )}
      {role === 'MANAGER' && (
        <SimpleBar
          title="Delete Task"
          childrenButtons={(
            <Button color="secondary" onClick={() => setDeletePopUp(true)}>
              Delete
            </Button>
          )}
        >
          <Typography variant="body1">Once you delete a task, there is no going back. Please be certain.</Typography>
        </SimpleBar>
      )}
      <Dialog open={deletePopUp} onClose={() => setDeletePopUp(false)} maxWidth="md">
        <DialogTitle>
          <Typography variant="h4">Delete Problem</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Class" childrenType="text" textColor="secondary">
            <Typography variant="body1">{`${courses[courseId].name} ${classes[classId].name}`}</Typography>
          </AlignedText>
          <AlignedText text="Title" childrenType="text" textColor="secondary">
            <Typography variant="body1">
              {problems[problemId] === undefined ? 'error' : problems[problemId].title}
            </Typography>
          </AlignedText>
          <AlignedText text="Label" childrenType="text" textColor="secondary">
            <Typography variant="body1">
              {problems[problemId] === undefined ? 'error' : problems[problemId].challenge_label}
            </Typography>
          </AlignedText>
          <Typography variant="body2">Once you delete a problem, there is no going back. Please be certain.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletePopUp(false)}>Cancel</Button>
          <Button color="secondary" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={emailSentPopup} keepMounted onClose={() => setEmailSentPopup(false)}>
        <DialogTitle id="alert-dialog-slide-title">
          <Typography variant="h4">All Testcases sent</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">Please check your mailbox.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailSentPopup(false)} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
