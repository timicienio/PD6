import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, makeStyles, TextField, MenuItem, FormControl, Select, Snackbar,
} from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import AlignedText from '../../../ui/AlignedText';
import PageTitle from '../../../ui/PageTitle';

import { readProblemInfo, submitCode } from '../../../../actions/myClass/problem';
import { browseSubmitLang } from '../../../../actions/common/common';

import NoMatch from '../../../noMatch';

const useStyles = makeStyles(() => ({
  selectField: {
    width: '300px',
  },
  codingField: {
    flexGrow: 1,
    width: 'auto',
  },
  bottomButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '35px',
    marginRight: '-5px',
  },
}));

/* This is a level 4 component (page component) */
export default function CodeSubmission() {
  const {
    courseId, classId, challengeId, problemId,
  } = useParams();
  const history = useHistory();
  const classNames = useStyles();
  const [cookies, setCookie] = useCookies(['lang']);

  const dispatch = useDispatch();

  const problems = useSelector((state) => state.problem.byId);
  const challenges = useSelector((state) => state.challenges.byId);
  const submitLang = useSelector((state) => state.submitLangs);
  const [lang, setLang] = useState([]);
  const authToken = useSelector((state) => state.auth.token);
  const errors = useSelector((state) => state.error.myClass.problem);

  const [langId, setLangId] = useState(-1);
  const [code, setCode] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const enabledIds = submitLang.allIds.filter((id) => !submitLang.byId[id].is_disabled);
    setLang(enabledIds);
    if (cookies.lang) {
      if (enabledIds.includes(Number(cookies.lang))) {
        setLangId(Number(cookies.lang));
      }
    }
  }, [cookies.lang, submitLang.allIds, submitLang.byId]);

  const onSubmitSuccess = () => {
    history.push(`/all-class/${courseId}/${classId}/challenge/${challengeId}/${problemId}/my-submission`);
  };

  const handleSubmit = () => {
    if (langId === -1) {
      return;
    }
    dispatch(submitCode(authToken, problemId, langId, code, onSubmitSuccess, () => { setShowSnackbar(true); }));
    const daysToExpire = new Date(2147483647 * 1000);
    setCookie('lang', langId, { path: '/', expires: daysToExpire });
  };

  useEffect(() => {
    dispatch(readProblemInfo(authToken, problemId));
  }, [authToken, dispatch, problemId]);

  useEffect(() => {
    dispatch(browseSubmitLang(authToken));
  }, [authToken, dispatch]);

  if (problems[problemId] === undefined || challenges[challengeId] === undefined) {
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle text={`${challenges[challengeId].title} / ${problems[problemId].challenge_label} / Code Submission`} />
      <AlignedText text="Language" maxWidth="lg" childrenType="field">
        <FormControl variant="outlined" className={classNames.selectField}>
          <Select
            labelId="sort"
            id="sort"
            value={langId}
            onChange={(e) => {
              setLangId(e.target.value);
            }}
          >
            <MenuItem key={-1} value="">
              <em>None</em>
            </MenuItem>
            {lang.map((key) => (
              <MenuItem key={submitLang.byId[key].id} value={submitLang.byId[key].id}>
                {`${submitLang.byId[key].name} ${submitLang.byId[key].version}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </AlignedText>
      <AlignedText text="Content" maxWidth="lg" childrenType="field">
        <TextField
          className={classNames.codingField}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
          multiline
          minRows={10}
          maxRows={20}
        />
      </AlignedText>
      <div className={classNames.bottomButton}>
        <Button
          color="default"
          onClick={() => history.push(`/all-class/${courseId}/${classId}/challenge/${challengeId}/${problemId}`)}
        >
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={code === '' || langId === -1}>
          Submit
        </Button>
      </div>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackbar(false);
        }}
        message={`Error: ${errors.submitCode}`}
      />
    </>
  );
}
