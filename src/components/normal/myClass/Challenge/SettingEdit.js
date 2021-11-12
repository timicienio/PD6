import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField, makeStyles } from '@material-ui/core';
import moment from 'moment-timezone';

import { editChallenge } from '../../../../actions/myClass/challenge';
import { fetchChallenge } from '../../../../actions/common/common';
import RadioGroupForm from '../../../ui/RadioGroupForm';
import DateRangePicker from '../../../ui/DateRangePicker';
import AlignedText from '../../../ui/AlignedText';
import SimpleBar from '../../../ui/SimpleBar';

const useStyles = makeStyles(() => ({
  dateRangePicker: {
    width: '44vw',
    marginTop: '15px',
    marginBottom: '0px',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '-10px',
    marginRight: '-5px',
  },
}));

export default function SettingEdit({ challengeId, challenge, setEdit }) {
  const classes = useStyles();

  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const editLoading = useSelector((state) => state.loading.myClass.challenge.editChallenge);

  const [editTitle, setEditTitle] = useState(challenge.title);
  const [duration, setDuration] = useState([
    {
      startDate: moment(challenge.start_time).toDate(),
      endDate: moment(challenge.end_time).toDate(),
      key: 'selection',
    },
  ]);
  const [selectionType, setSelectionType] = useState(challenge.selection_type);
  const [publicizeType, setPublicizeType] = useState(challenge.publicize_type);
  const [hasRequest, setHasRequest] = useState(false);

  const handleClickSave = () => {
    const body = {
      title: editTitle,
      start_time: duration[0].startDate.toISOString(),
      end_time: duration[0].endDate.toISOString(),
      publicize_type: publicizeType,
      selection_type: selectionType,
    };
    dispatch(editChallenge(authToken, challengeId, body));
    setHasRequest(true);
  };

  useEffect(() => {
    if (hasRequest && !editLoading) {
      setHasRequest(false);
      dispatch(fetchChallenge(authToken, challengeId));
      setEdit(false);
    }
  }, [authToken, challengeId, dispatch, editLoading, hasRequest, setEdit]);

  return (
    <>
      <SimpleBar title="Information">
        <AlignedText text="Title" childrenType="field" maxWidth="lg">
          <TextField defaultValue={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
        </AlignedText>
        <AlignedText text="Duration" childrenType="field" maxWidth="lg">
          <DateRangePicker className={classes.dateRangePicker} value={duration} setValue={setDuration} />
        </AlignedText>
        <AlignedText text="Scored by" childrenType="radio" maxWidth="lg">
          <RadioGroupForm
            options={[
              {
                label: 'Last Score',
                value: 'LAST',
              },
              {
                label: 'Best Score',
                value: 'BEST',
              },
            ]}
            selectedValue={selectionType}
            setSelectedValue={setSelectionType}
            flexDirection="row"
          />
        </AlignedText>
        <AlignedText text="Shown in Problem Set" childrenType="radio" maxWidth="lg">
          <RadioGroupForm
            options={[
              {
                label: 'On Start Time',
                value: 'START_TIME',
              },
              {
                label: 'On End Time',
                value: 'END_TIME',
              },
            ]}
            selectedValue={publicizeType}
            setSelectedValue={setPublicizeType}
            flexDirection="row"
          />
        </AlignedText>
      </SimpleBar>
      <div className={classes.buttons}>
        <Button
          onClick={() => {
            setEdit(false);
          }}
        >
          Cancel
        </Button>
        <Button color="primary" onClick={handleClickSave}>
          Save
        </Button>
      </div>
    </>
  );
}
