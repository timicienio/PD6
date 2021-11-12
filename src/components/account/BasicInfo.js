import React from 'react';

import { Button, Typography } from '@material-ui/core';
import SimpleBar from '../ui/SimpleBar';
import AlignedText from '../ui/AlignedText';

export default function BasicInfo(props) {
  return (
    <div>
      <SimpleBar
        title="Basic Information"
        buttons={(
          <>
            <Button onClick={() => props.handleEdit()}>Edit</Button>
          </>
        )}
      >
        <>
          <AlignedText text="Username" childrenType="text">
            <Typography variant="body1">{props.userName}</Typography>
          </AlignedText>
          <AlignedText text="Real name" childrenType="text">
            <Typography variant="body1">{props.realName}</Typography>
          </AlignedText>
          <AlignedText text="Nickname" childrenType="text">
            <Typography variant="body1">{props.nickName}</Typography>
          </AlignedText>
          <AlignedText text="Alternative Email" childrenType="text">
            <Typography variant="body1">{props.altMail}</Typography>
          </AlignedText>
        </>
      </SimpleBar>
    </div>
  );
}
