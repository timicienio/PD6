import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, makeStyles, TextField } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import SimpleBar from '../../../../ui/SimpleBar';
import { editEssay } from '../../../../../actions/myClass/essay';

const useStyles = makeStyles(() => ({
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '-15px',
  },
  textfield: {
    width: '400px',
  },
  textfield2: {
    width: '100%',
  },
}));

/* This is a level 4 component (page component) */
export default function EssayEdit({ closeEdit }) {
  const {
    essayId,
  } = useParams();
  const classNames = useStyles();

  const dispatch = useDispatch();

  const essays = useSelector((state) => state.essays.byId);
  const authToken = useSelector((state) => state.auth.token);
  // const loading = useSelector((state) => state.loading.myClass.essay);

  const [label, setLabel] = useState(essays[essayId] === undefined ? 'error' : essays[essayId].challenge_label);
  const [title, setTitle] = useState(essays[essayId] === undefined ? 'error' : essays[essayId].title);
  const [description, setDescription] = useState(essays[essayId] === undefined ? 'error' : essays[essayId].description);

  const handleClickSave = () => {
    dispatch(editEssay(authToken, essayId, label, title, description));
    closeEdit();
  };

  return (
    <>
      <SimpleBar title="Label" noIndent>
        <TextField
          value={label}
          variant="outlined"
          onChange={(e) => {
            setLabel(e.target.value);
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
          }}
          className={classNames.textfield}
        />
      </SimpleBar>
      <SimpleBar title="Description" noIndent>
        <TextField
          value={description}
          variant="outlined"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          multiline
          minRows={10}
          maxRows={10}
          className={classNames.textfield2}
        />
      </SimpleBar>
      <div className={classNames.buttons}>
        <Button color="default" onClick={() => closeEdit()}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleClickSave}>
          Save
        </Button>
      </div>
    </>
  );
}
