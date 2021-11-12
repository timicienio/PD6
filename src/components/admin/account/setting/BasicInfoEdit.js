import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button, TextField, Typography, makeStyles,
} from '@material-ui/core';
import SimpleBar from '../../../ui/SimpleBar';
import AlignedText from '../../../ui/AlignedText';
import { editAccount } from '../../../../actions/admin/account';

const useStyles = makeStyles(() => ({
  buttons: {
    marginTop: '6px',
    marginLeft: '-5px',
  },
}));

export default function BasicInfoEdit(props) {
  const [userName] = useState(props.userName);
  const [inputs, setInputs] = useState({
    realName: props.realName,
    nickName: props.nickName,
    altMail: props.altMail,
  });
  const [errors, setErrors] = useState({
    realName: false,
  });
  const [errorTexts, setErrorTexts] = useState({
    realName: '',
  });
  const classes = useStyles();

  const { accountId } = useParams();
  const authToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const handleSave = () => {
    if (inputs.realName === '') {
      setErrors((ori) => ({ ...ori, realName: true }));
      setErrorTexts((ori) => ({ ...ori, realName: "Can't be empty" }));
      return;
    }
    const altMailChanged = inputs.altMail !== props.altMail && inputs.altMail !== '';
    dispatch(
      editAccount(authToken, accountId, inputs.realName, inputs.nickName, altMailChanged ? inputs.altMail : null),
    );
    props.handleBack(altMailChanged ? 'Alternative email will be updated once it’s verified.' : '');
  };

  const handleCancel = () => {
    props.handleBack('');
    setErrors({ realName: false });
    setErrorTexts({ realName: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((input) => ({ ...input, [name]: value }));

    if (name === 'realName' && value !== '') {
      setErrors((ori) => ({ ...ori, realName: false }));
      setErrorTexts((ori) => ({ ...ori, realName: '' }));
    }
  };

  return (
    <div>
      <SimpleBar title="Basic Information">
        <>
          <AlignedText text="Username" childrenType="text" maxWidth="lg">
            <Typography variant="body1">{userName}</Typography>
          </AlignedText>
          <AlignedText text="Real name" childrenType="field" maxWidth="lg">
            <TextField
              name="realName"
              value={inputs.realName}
              variant="outlined"
              onChange={(e) => handleChange(e)}
              error={errors.realName}
              helperText={errorTexts.realName}
            />
          </AlignedText>
          <AlignedText text="Nickname" childrenType="field" maxWidth="lg">
            <TextField name="nickName" value={inputs.nickName} onChange={(e) => handleChange(e)} />
          </AlignedText>
          <AlignedText text="Alternative Email" childrenType="field" maxWidth="lg">
            <TextField value={inputs.altMail} name="altMail" onChange={(e) => handleChange(e)} />
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
