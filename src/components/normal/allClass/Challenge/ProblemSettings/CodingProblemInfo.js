import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// https://mathpix.com/docs/mathpix-markdown/overview
import { MathpixMarkdown, MathpixLoader } from 'mathpix-markdown-it';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import SimpleBar from '../../../../ui/SimpleBar';
import SimpleTable from '../../../../ui/SimpleTable';
import SampleTestArea from '../../../../ui/SampleTestArea';

import NoMatch from '../../../../noMatch';
import GeneralLoading from '../../../../GeneralLoading';

import { browseTestcase } from '../../../../../actions/myClass/problem';

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

/* This is a level 4 component (page component) */
export default function CodingProblemInfo() {
  const { courseId, classId, problemId } = useParams();
  const classNames = useStyles();

  const dispatch = useDispatch();

  const classes = useSelector((state) => state.classes.byId);
  const courses = useSelector((state) => state.courses.byId);
  const problems = useSelector((state) => state.problem.byId);
  const testcases = useSelector((state) => state.testcases.byId);
  // const [status, setStatus] = useState(true);

  const authToken = useSelector((state) => state.auth.token);
  // const error = useSelector((state) => state.error);
  const loading = useSelector((state) => state.loading.myClass.problem);

  const [sampleDataIds, setSampleDataIds] = useState([]);
  const [testcaseDataIds, setTestcaseDataIds] = useState([]);
  // console.log('uploadError: ', uploadError);

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
      // if (testcasesId.length === 0) {
      //   setStatus(true);
      // } else {
      //   setStatus(!testcases[testcasesId[0]].is_disabled);
      // }
    }
  }, [problems, problemId, testcases, sampleTransToNumber, testcaseTransToNumber]);

  useEffect(() => {
    dispatch(browseTestcase(authToken, problemId));
  }, [authToken, dispatch, problemId]);

  if (loading.readProblem || loading.browseTestcase || loading.browseAssistingData) {
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
      <SimpleBar noIndent title="Testing Data">
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
              align: 'center',
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
    </>
  );
}
