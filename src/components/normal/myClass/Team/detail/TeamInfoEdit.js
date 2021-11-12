import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button, TextField, Typography, makeStyles,
} from '@material-ui/core';
import SimpleBar from '../../../../ui/SimpleBar';
import AlignedText from '../../../../ui/AlignedText';
import { editTeam } from '../../../../../actions/myClass/team';

const useStyles = makeStyles(() => ({
  buttons: {
    marginLeft: '-5px',
    marginTop: '16px',
  },
}));

export default function BasicInfoEdit(props) {
  const classNames = useStyles();
  const dispatch = useDispatch();
  const { classId, teamId } = useParams();

  const authToken = useSelector((state) => state.auth.token);
  const [teamName, setTeamName] = useState(props.teamName);
  const [label, setLabel] = useState(props.label);

  const handleSave = () => {
    if (teamName !== '' && label !== '') {
      dispatch(editTeam(authToken, teamId, teamName, classId, label));
    }
    props.handleBack();
  };

  return (
    <div>
      <SimpleBar title="Team Information">
        <>
          <AlignedText text="Team Name" maxWidth="lg" childrenType="field">
            <TextField value={teamName} onChange={(e) => setTeamName(e.target.value)} />
          </AlignedText>
          {props.isManager ? (
            <AlignedText text="Label" maxWidth="lg" childrenType="field">
              <TextField value={label} onChange={(e) => setLabel(e.target.value)} />
            </AlignedText>
          ) : (
            <div>
              <AlignedText text="Label" maxWidth="lg" childrenType="text">
                <Typography variant="body1">{label}</Typography>
              </AlignedText>
            </div>
          )}
          <div className={classNames.buttons}>
            <Button onClick={() => props.handleBack()}>Cancel</Button>
            <Button color="primary" type="submit" onClick={handleSave}>
              Save
            </Button>
          </div>
        </>
      </SimpleBar>
    </div>
  );
}
