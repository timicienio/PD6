import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, TextField, Typography, makeStyles,
} from '@material-ui/core';
import SimpleBar from '../ui/SimpleBar';
import AlignedText from '../ui/AlignedText';
import { editAccount } from '../../actions/user/user';

const useStyles = makeStyles(() => ({
  buttons: {
    marginTop: '6px',
    marginLeft: '-5px',
  },
}));

export default function BasicInfoEdit(props) {
  const [realName] = useState(props.realName);
  const [userName] = useState(props.userName);
  const [nickName, setNickName] = useState(props.nickName);
  const [altMail, setAltMail] = useState(props.altMail);
  const classes = useStyles();
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const accountId = useSelector((state) => state.user.id);
  const authToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const handleSave = () => {
    const altMailChanged = altMail !== props.altMail && altMail !== '';
    dispatch(editAccount(authToken, accountId, nickName, altMailChanged ? altMail : null));
    props.handleBack(altMailChanged ? 'Alternative email will be updated once it’s verified.' : '');
  };

  const handleCancel = () => {
    props.handleBack('');
    setError(false);
    setErrorText('');
  };

  return (
    <div>
      <SimpleBar title="Basic Information">
        <>
          <AlignedText text="Username" childrenType="text" maxWidth="lg">
            <Typography variant="body1">{userName}</Typography>
          </AlignedText>
          <AlignedText text="Real name" childrenType="text" maxWidth="lg">
            <Typography variant="body1">{realName}</Typography>
          </AlignedText>
          <AlignedText text="Nickname" childrenType="field" maxWidth="lg">
            <TextField
              value={nickName}
              onChange={(e) => {
                setNickName(e.target.value);
              }}
              error={error}
              helperText={errorText}
            />
          </AlignedText>
          <AlignedText text="Alternative Email" childrenType="field" maxWidth="lg">
            <TextField
              value={altMail}
              onChange={(e) => {
                setAltMail(e.target.value);
              }}
            />
          </AlignedText>
          <div className={classes.buttons}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button color="primary" type="submit" onClick={handleSave}>
              Save
            </Button>
          </div>
        </>
      </SimpleBar>
    </div>
  );
}
