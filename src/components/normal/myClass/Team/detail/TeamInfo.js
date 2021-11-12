import React from 'react';
import {
  Button, Typography,
} from '@material-ui/core';
import SimpleBar from '../../../../ui/SimpleBar';
import AlignedText from '../../../../ui/AlignedText';

export default function BasicInfo(props) {
  return (
    <div>
      <SimpleBar
        title="Team Information"
        buttons={
          props.isManager && (
          <>
            <Button onClick={() => props.handleEdit()}>Edit</Button>
          </>
          )
        }
      >
        <>
          <AlignedText text="Team Name" maxWidth="lg" childrenType="text">
            <Typography variant="body1">{props.teamName}</Typography>
          </AlignedText>
          <AlignedText text="Label" maxWidth="lg" childrenType="text">
            <Typography variant="body1">{props.label}</Typography>
          </AlignedText>
        </>
      </SimpleBar>
    </div>
  );
}
