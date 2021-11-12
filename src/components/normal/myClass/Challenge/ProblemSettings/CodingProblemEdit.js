import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  Button,
  makeStyles,
  withStyles,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  FormControlLabel,
  Switch,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import SimpleBar from '../../../../ui/SimpleBar';
import SimpleTable from '../../../../ui/SimpleTable';
import Icon from '../../../../ui/icon/index';
import AlignedText from '../../../../ui/AlignedText';

import SampleUploadCard from './SampleUploadCard';
import AssistingDataUploadCard from './AssistingDataUploadCard';
import TestingDataUploadCard from './TestingDataUploadCard';

import {
  editProblemInfo,
  saveSamples,
  saveTestcases,
  readProblemWithJudgeCode,
  saveAssistingData,
} from '../../../../../actions/myClass/problem';

import GeneralLoading from '../../../../GeneralLoading';

const useStyles = makeStyles(() => ({
  sampleArea: {
    marginTop: '50px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  textfield: {
    width: '400px',
  },
  textfield2: {
    width: '100%',
  },
  loadButtons: {
    width: 'max-content',
  },
  statusSwitch: {
    marginTop: '20px',
  },
  dialogTitle: {
    marginBottom: '-8px',
  },
  backToEditButton: {
    marginLeft: '24px',
  },
  dialogButtons: {
    justifyContent: 'space-between',
  },
  select: {
    width: '350px',
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
export default function CodingProblemEdit({ closeEdit }) {
  const { problemId } = useParams();
  const classNames = useStyles();

  const dispatch = useDispatch();

  const problems = useSelector((state) => state.problem.byId);
  const authToken = useSelector((state) => state.auth.token);

  const assistingData = useSelector((state) => state.assistingData.byId);
  const testcases = useSelector((state) => state.testcases.byId);
  const [sampleDataIds, setSampleDataIds] = useState([]);
  const [testcaseDataIds, setTestcaseDataIds] = useState([]);
  const loading = useSelector((state) => state.loading.myClass.problem);
  const [hasChange, setHasChange] = useState(false);

  const [label, setLabel] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ioDescription, setIoDescription] = useState('');
  const [source, setSource] = useState('');
  const [hint, setHint] = useState('');
  const [judgeType, setJudgeType] = useState('');
  const [language, setLanguage] = useState('Python');
  const [judgeCode, setJudgeCode] = useState('');
  const [status, setStatus] = useState(true);

  const [handleInfoSuccess, setHandleInfoSuccess] = useState(false);
  const [handleSamplesSuccess, setHandleSamplesSuccess] = useState(false);
  const [handleTestcasesSuccess, setHandleTestcasesSuccess] = useState(false);
  const [handleAssistingDataSuccess, setHandleAssistingDataSuccess] = useState(false);
  const [uploadFailFilename, setUploadFailFilename] = useState([]);
  const [uploadFailCardPopup, setUploadFailCardPopup] = useState(false);

  const [sampleTableData, setSampleTableData] = useState([]);
  const [testcaseTableData, setTestcaseTableData] = useState([]);

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

  const sampleTrans = (id) => {
    if (sampleTableData[id].input_filename !== null) {
      return Number(sampleTableData[id].input_filename.slice(6, sampleTableData[id].input_filename.indexOf('.')));
    }
    if (sampleTableData[id].output_filename !== null) {
      return Number(sampleTableData[id].output_filename.slice(6, sampleTableData[id].output_filename.indexOf('.')));
    }
    return 0;
  };

  const testcaseTrans = (id) => {
    if (testcaseTableData[id].input_filename !== null) {
      return Number(testcaseTableData[id].input_filename.slice(0, testcaseTableData[id].input_filename.indexOf('.')));
    }
    if (testcaseTableData[id].output_filename !== null) {
      return Number(testcaseTableData[id].output_filename.slice(0, testcaseTableData[id].output_filename.indexOf('.')));
    }
    return 0;
  };

  const judgeLanguageTrans = (lang) => {
    if (lang === 'Python') {
      return 'python 3.8';
    }
    return 0;
  };

  useEffect(() => {
    if (problems[problemId]) {
      setLabel(problems[problemId].challenge_label);
      setTitle(problems[problemId].title);
      setDescription(problems[problemId].description);
      setIoDescription(problems[problemId].io_description);
      setSource(problems[problemId].source);
      setHint(problems[problemId].hint);
      setJudgeType(problems[problemId].judge_type);
      if (problems[problemId].judge_type === 'CUSTOMIZED') {
        setLanguage('Python');
      }
      if (problems[problemId].judge_source && problems[problemId].judge_source.judge_code) {
        setJudgeCode(problems[problemId].judge_source.judge_code);
      }
    }
  }, [problems, problemId]);

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
      // set original table data
      setSampleTableData(
        samplesId.reduce(
          (acc, id) => ({
            ...acc,
            [id]: {
              id: testcases[id].id,
              no: sampleTransToNumber(id),
              time_limit: testcases[id].time_limit,
              memory_limit: testcases[id].memory_limit,
              score: testcases[id].score,
              input_filename: testcases[id].input_filename,
              output_filename: testcases[id].output_filename,
              in_file: null,
              out_file: null,
              new: false,
              note: testcases[id].note,
            },
          }),
          {},
        ),
      );
      setTestcaseTableData(
        testcasesId.reduce(
          (acc, id) => ({
            ...acc,
            [id]: {
              id: testcases[id].id,
              no: testcaseTransToNumber(id),
              time_limit: testcases[id].time_limit,
              memory_limit: testcases[id].memory_limit,
              score: testcases[id].score,
              input_filename: testcases[id].input_filename,
              output_filename: testcases[id].output_filename,
              in_file: null,
              out_file: null,
              new: false,
              note: testcases[id].note,
            },
          }),
          {},
        ),
      );
    }
  }, [problems, problemId, testcases, sampleTransToNumber, testcaseTransToNumber]);

  const [assistTableData, setAssistTableData] = useState([]);

  useEffect(() => {
    if (problems[problemId] !== undefined) {
      setAssistTableData(
        problems[problemId].assistingDataIds.map((id) => ({
          id,
          filename: assistingData[id].filename,
          file: null,
        })),
      );
    }
  }, [assistingData, problemId, problems]);

  const [cardSelectedFileS, setCardSelectedFileS] = useState({});
  const [cardSelectedFileT, setCardSelectedFileT] = useState({});
  const [cardSelectedFileA, setCardSelectedFileA] = useState([]);

  const [samplePopUp, setSamplePopUp] = useState(false);
  const [assistPopUp, setAssistPopUp] = useState(false);
  const [testingPopUp, setTestingPopUp] = useState(false);
  const [warningPopUp, setWarningPopUp] = useState(false);

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (handleSamplesSuccess && handleTestcasesSuccess && handleInfoSuccess && handleAssistingDataSuccess) {
      if (uploadFailFilename.length === 0) {
        dispatch(readProblemWithJudgeCode(authToken, problemId));
        setDisabled(false);
        closeEdit();
      } else {
        setDisabled(false);
        setUploadFailCardPopup(true);
      }
    }
  }, [
    authToken,
    closeEdit,
    dispatch,
    handleAssistingDataSuccess,
    handleInfoSuccess,
    handleSamplesSuccess,
    handleTestcasesSuccess,
    problemId,
    uploadFailFilename.length,
  ]);

  const handleClosePopUp = () => {
    setSamplePopUp(false);
    setAssistPopUp(false);
    setTestingPopUp(false);
  };

  const handleSetSampleTableData = (tableData) => {
    setSampleTableData(
      tableData.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: item,
        }),
        {},
      ),
    );
  };
  const handleSetTestcaseTableData = (tableData) => {
    setTestcaseTableData(
      tableData.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: item,
        }),
        {},
      ),
    );
  };

  const handleSampleConfirm = (newSelectedFiles) => {
    const newTableData = Object.keys(newSelectedFiles).reduce((acc, item) => {
      const keys = Object.keys(sampleTableData).filter((key) => sampleTableData[key].no === newSelectedFiles[item].no);
      if (keys.length === 0) {
        // this is new case
        return {
          ...acc,
          [-item]: {
            id: -item,
            no: newSelectedFiles[item].no,
            label: newSelectedFiles[item].no,
            time_limit: newSelectedFiles[item].time_limit,
            memory_limit: newSelectedFiles[item].memory_limit,
            input_filename: newSelectedFiles[item].in === null ? null : newSelectedFiles[item].in.name,
            output_filename: newSelectedFiles[item].out === null ? null : newSelectedFiles[item].out.name,
            in_file: newSelectedFiles[item].in,
            out_file: newSelectedFiles[item].out,
            new: true,
            note: '',
          },
        };
      }
      // testcase has been existed
      return {
        ...acc,
        [keys[0]]: {
          id: Number(keys[0]),
          no: newSelectedFiles[item].no,
          label: newSelectedFiles[item].no,
          time_limit: newSelectedFiles[item].time_limit,
          memory_limit: newSelectedFiles[item].memory_limit,
          input_filename:
            newSelectedFiles[item].in === null
              ? sampleTableData[keys[0]].input_filename
              : newSelectedFiles[item].in.name,
          output_filename:
            newSelectedFiles[item].out === null
              ? sampleTableData[keys[0]].output_filename
              : newSelectedFiles[item].out.name,
          in_file: newSelectedFiles[item].in === null ? sampleTableData[keys[0]].in_file : newSelectedFiles[item].in,
          out_file:
            newSelectedFiles[item].out === null ? sampleTableData[keys[0]].out_file : newSelectedFiles[item].out,
          new: sampleTableData[keys[0]].new,
          note: sampleTableData[keys[0]].note,
        },
      };
    }, sampleTableData);
    // console.log(newTableData);
    setSampleTableData(newTableData);
    setCardSelectedFileS({});
    setHasChange(true);
    setSamplePopUp(false);
  };

  const handleTestingConfirm = (newSelectedFiles) => {
    const newTableData = Object.keys(newSelectedFiles).reduce((acc, item) => {
      const keys = Object.keys(testcaseTableData).filter(
        (key) => testcaseTableData[key].no === newSelectedFiles[item].no,
      );
      if (keys.length === 0) {
        // this is new case
        return {
          ...acc,
          [-item]: {
            id: -item,
            no: newSelectedFiles[item].no,
            label: newSelectedFiles[item].no,
            score: newSelectedFiles[item].score,
            time_limit: newSelectedFiles[item].time_limit,
            memory_limit: newSelectedFiles[item].memory_limit,
            input_filename: newSelectedFiles[item].in === null ? null : newSelectedFiles[item].in.name,
            output_filename: newSelectedFiles[item].out === null ? null : newSelectedFiles[item].out.name,
            in_file: newSelectedFiles[item].in,
            out_file: newSelectedFiles[item].out,
            new: true,
            note: '',
          },
        };
      }
      // testcase has been existed
      return {
        ...acc,
        [keys[0]]: {
          id: Number(keys[0]),
          no: newSelectedFiles[item].no,
          label: newSelectedFiles[item].no,
          score: newSelectedFiles[item].score,
          time_limit: newSelectedFiles[item].time_limit,
          memory_limit: newSelectedFiles[item].memory_limit,
          input_filename:
            newSelectedFiles[item].in === null
              ? testcaseTableData[keys[0]].input_filename
              : newSelectedFiles[item].in.name,
          output_filename:
            newSelectedFiles[item].out === null
              ? testcaseTableData[keys[0]].output_filename
              : newSelectedFiles[item].out.name,
          in_file: newSelectedFiles[item].in === null ? testcaseTableData[keys[0]].in_file : newSelectedFiles[item].in,
          out_file:
            newSelectedFiles[item].out === null ? testcaseTableData[keys[0]].out_file : newSelectedFiles[item].out,
          new: testcaseTableData[keys[0]].new,
          note: testcaseTableData[keys[0]].note,
        },
      };
    }, testcaseTableData);
    setTestcaseTableData(newTableData);
    setCardSelectedFileT({});
    setHasChange(true);
    setTestingPopUp(false);
  };

  const handleAssistConfirm = () => {
    // add file to table;
    const newData = cardSelectedFileA.reduce((acc, file) => {
      const index = assistTableData.findIndex((item) => item.filename === file.name);
      if (index === -1) {
        return [...acc, { id: file.name, filename: file.name, file }];
      }

      const newArray = acc;
      newArray[index] = { id: acc[index].id, filename: file.name, file };
      return newArray;
    }, assistTableData);
    setAssistTableData(newData);
    setCardSelectedFileA([]);
    setHasChange(true);
    setAssistPopUp(false);
  };

  const handleFileUploadFail = (filename) => {
    setUploadFailFilename([...uploadFailFilename, filename]);
  };

  const handleSave = () => {
    const newFullScore = Object.keys(testcaseTableData).reduce(
      (acc, key) => acc + Number(testcaseTableData[key].score),
      0,
    );
    dispatch(
      editProblemInfo(
        authToken,
        problemId,
        label,
        title,
        judgeType,
        newFullScore,
        !status,
        description,
        ioDescription,
        source,
        hint,
        judgeLanguageTrans(language),
        judgeCode,
        () => {
          setHandleInfoSuccess(true);
        },
      ),
    );

    dispatch(
      saveSamples(
        authToken,
        problemId,
        testcases,
        sampleDataIds,
        sampleTableData,
        () => {
          setHandleSamplesSuccess(true);
        },
        handleFileUploadFail,
      ),
    );
    dispatch(
      saveTestcases(
        authToken,
        problemId,
        testcases,
        testcaseDataIds,
        testcaseTableData,
        status,
        () => {
          setHandleTestcasesSuccess(true);
        },
        handleFileUploadFail,
      ),
    );
    dispatch(
      saveAssistingData(
        authToken,
        problemId,
        assistingData,
        problems[problemId].assistingDataIds,
        assistTableData,
        () => {
          setHandleAssistingDataSuccess(true);
        },
        handleFileUploadFail,
      ),
    );

    setDisabled(true);
  };

  const handleCancel = () => {
    if (hasChange) {
      setWarningPopUp(true);
    } else {
      closeEdit();
    }
  };

  if (
    loading.editProblem
    || loading.deleteProblem
    || loading.deleteTestcase
    || loading.deleteAssistingData
    || loading.editAssistingData
    || loading.addAssistingData
    || loading.editTestcase
    || loading.uploadTestcaseInput
    || loading.uploadTestcaseOutput
    || loading.addTestcase
    || disabled
  ) {
    return <GeneralLoading />;
  }

  return (
    <>
      <SimpleBar title="Label" noIndent>
        <TextField
          value={label}
          variant="outlined"
          onChange={(e) => {
            setLabel(e.target.value);
            setHasChange(true);
          }}
          className={classNames.textfield}
        />
      </SimpleBar>
      <SimpleBar title="Title" noIndent>
        <TextField
          value={title}
          variant="outlined"
          onChange={(e) => {
            setTitle(e.target.value);
            setHasChange(true);
          }}
          className={classNames.textfield}
        />
      </SimpleBar>
      <SimpleBar title="Description" noIndent>
        <TextField
          placeholder="(Text, LaTeX, Markdown and HTML supported)"
          value={description}
          variant="outlined"
          onChange={(e) => {
            setDescription(e.target.value);
            setHasChange(true);
          }}
          multiline
          minRows={10}
          maxRows={10}
          className={classNames.textfield2}
        />
      </SimpleBar>
      <SimpleBar title="About Input and Output" noIndent>
        <TextField
          placeholder="(Text, LaTeX, Markdown and HTML supported)"
          value={ioDescription}
          variant="outlined"
          onChange={(e) => {
            setIoDescription(e.target.value);
            setHasChange(true);
          }}
          multiline
          minRows={10}
          maxRows={10}
          className={classNames.textfield2}
        />
      </SimpleBar>
      <SimpleBar title="Source" noIndent>
        <TextField
          value={source}
          variant="outlined"
          onChange={(e) => {
            setSource(e.target.value);
            setHasChange(true);
          }}
          className={classNames.textfield}
        />
      </SimpleBar>
      <SimpleBar title="Hint" noIndent>
        <TextField
          value={hint}
          variant="outlined"
          onChange={(e) => {
            setHint(e.target.value);
            setHasChange(true);
          }}
          multiline
          minRows={5}
          maxRows={5}
          className={classNames.textfield2}
        />
      </SimpleBar>
      <SimpleBar title="Sample Data" noIndent>
        <div className={classNames.loadButtons}>
          <StyledButton
            variant="outlined"
            color="primary"
            startIcon={<Icon.Upload />}
            onClick={() => setSamplePopUp(true)}
          >
            Upload
          </StyledButton>
        </div>
        <SimpleTable
          isEdit
          hasDelete
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
              minWidth: 180,
              align: 'center',
              width: 150,
              type: 'string',
              editType: 'input',
            },
            {
              id: 'memory_limit',
              label: 'Max Memory (kb)',
              minWidth: 180,
              align: 'center',
              width: 150,
              type: 'string',
              editType: 'input',
            },
            {
              id: 'input_filename',
              label: 'Input File',
              minWidth: 150,
              align: 'center',
              width: 150,
              type: 'string',
            },
            {
              id: 'output_filename',
              label: 'Output File',
              minWidth: 50,
              align: 'center',
              width: 150,
              type: 'string',
            },
            {
              id: 'note',
              label: 'Note',
              align: 'center',
              width: '100%',
              type: 'string',
              editType: 'flexibleInput',
            },
          ]}
          data={Object.keys(sampleTableData)
            .sort((a, b) => sampleTrans(a) - sampleTrans(b))
            .map((key) => sampleTableData[key])}
          setData={handleSetSampleTableData}
        />
      </SimpleBar>
      <SimpleBar
        title="Testing Data"
        buttons={(
          <FormControlLabel
            control={(
              <Switch
                checked={status}
                onChange={() => {
                  setStatus(!status);
                  setHasChange(true);
                }}
                name="status"
                color="primary"
              />
            )}
            label={status ? 'Enabled' : 'Disabled'}
            className={classNames.statusSwitch}
          />
        )}
        noIndent
      >
        <div className={classNames.loadButtons}>
          <StyledButton
            variant="outlined"
            color="primary"
            startIcon={<Icon.Upload />}
            onClick={() => setTestingPopUp(true)}
          >
            Upload
          </StyledButton>
        </div>
        <SimpleTable
          isEdit
          hasDelete
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
              minWidth: 180,
              align: 'center',
              width: 150,
              type: 'string',
              editType: 'input',
            },
            {
              id: 'memory_limit',
              label: 'Max Memory (kb)',
              minWidth: 180,
              align: 'center',
              width: 150,
              type: 'string',
              editType: 'input',
            },
            {
              id: 'score',
              label: 'Score',
              minWidth: 50,
              align: 'center',
              width: 80,
              type: 'string',
              editType: 'input',
            },
            {
              id: 'input_filename',
              label: 'Input File',
              minWidth: 150,
              align: 'center',
              width: 150,
              type: 'string',
            },
            {
              id: 'output_filename',
              label: 'Output File',
              minWidth: 150,
              align: 'center',
              width: 150,
              type: 'string',
            },
            {
              id: 'note',
              label: 'Note',
              align: 'center',
              width: '100%',
              type: 'string',
              editType: 'flexibleInput',
            },
          ]}
          data={Object.keys(testcaseTableData)
            .sort((a, b) => testcaseTrans(a) - testcaseTrans(b))
            .map((key) => testcaseTableData[key])}
          setData={handleSetTestcaseTableData}
        />
      </SimpleBar>
      <SimpleBar title="Assisting Data (Optional)" noIndent>
        <div className={classNames.loadButtons}>
          <StyledButton
            variant="outlined"
            color="primary"
            startIcon={<Icon.Upload />}
            onClick={() => setAssistPopUp(true)}
          >
            Upload
          </StyledButton>
        </div>
        <SimpleTable
          isEdit
          hasDelete
          columns={[
            {
              id: 'filename',
              label: 'File Name',
              minWidth: 40,
              align: 'center',
              width: 400,
              type: 'string',
            },
          ]}
          data={assistTableData}
          setData={setAssistTableData}
        />
      </SimpleBar>
      <SimpleBar title="Customized Judge Code (Optional)" noIndent>
        <AlignedText text="Judge method" childrenType="field">
          <FormControl variant="outlined" className={classNames.select}>
            <Select name="judgeMethod" value={judgeType} onChange={(e) => setJudgeType(e.target.value)}>
              <MenuItem value="NORMAL">No customized judge</MenuItem>
              <MenuItem value="CUSTOMIZED">Customized judge</MenuItem>
            </Select>
          </FormControl>
        </AlignedText>
        {judgeType !== 'NORMAL' && (
          <>
            <AlignedText text="Language" childrenType="field">
              <FormControl variant="outlined" className={classNames.select}>
                <Select name="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <MenuItem value="Python">Python</MenuItem>
                </Select>
              </FormControl>
            </AlignedText>
            <Typography variant="body1">Content</Typography>
            <TextField
              value={judgeCode}
              variant="outlined"
              onChange={(e) => {
                setJudgeCode(e.target.value);
                setHasChange(true);
              }}
              multiline
              minRows={15}
              maxRows={15}
              className={classNames.textfield2}
            />
          </>
        )}
      </SimpleBar>
      <div className={classNames.buttons}>
        <Button color="default" onClick={handleCancel}>
          Cancel
        </Button>
        <Button disabled={disabled} color="primary" onClick={handleSave}>
          Save
        </Button>
      </div>
      <SampleUploadCard
        popUp={samplePopUp}
        closePopUp={handleClosePopUp}
        selectedFile={cardSelectedFileS}
        setSelectedFile={setCardSelectedFileS}
        handleTempUpload={handleSampleConfirm}
      />
      <AssistingDataUploadCard
        popUp={assistPopUp}
        closePopUp={handleClosePopUp}
        selectedFile={cardSelectedFileA}
        setSelectedFile={setCardSelectedFileA}
        handleTempUpload={handleAssistConfirm}
      />
      <TestingDataUploadCard
        popUp={testingPopUp}
        closePopUp={handleClosePopUp}
        selectedFile={cardSelectedFileT}
        setSelectedFile={setCardSelectedFileT}
        handleTempUpload={handleTestingConfirm}
      />
      <Dialog open={warningPopUp} onClose={() => setWarningPopUp(false)} maxWidth="md">
        <DialogTitle id="dialog-slide-title" className={classNames.dialogTitle}>
          <Typography variant="h4">Unsaved Changes</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You have unsaved changes, do you want to save your changes or back to edit?
          </Typography>
        </DialogContent>
        <DialogActions className={classNames.dialogButtons}>
          <Button onClick={() => setWarningPopUp(false)} className={classNames.backToEditButton} variant="outlined">
            Back to Edit
          </Button>
          <div>
            <Button color="default" onClick={closeEdit}>
              Don’t Save
            </Button>
            <Button color="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        open={uploadFailCardPopup}
        onClose={() => {
          setUploadFailCardPopup(false);
          closeEdit();
        }}
        fullWidth
      >
        <DialogTitle id="dialog-slide-title">
          <Typography variant="h4">Upload Fail</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">File below was failed to be uploaded:</Typography>
          {uploadFailFilename.map((filename) => (
            <Typography variant="body2" key={filename}>
              {filename}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions className={classNames.filterButton}>
          <Button
            color="default"
            onClick={() => {
              setUploadFailCardPopup(false);
              closeEdit();
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
