import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import SimpleBar from '../../../../ui/SimpleBar';
import AlignedText from '../../../../ui/AlignedText';

const useStyles = makeStyles((theme) => ({
  textLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}));

export default function Grader(props) {
  const classNames = useStyles();

  return (
    <>
      <SimpleBar title="Grader">
        <AlignedText text="Username" maxWidth="lg" childrenType="text">
          <Typography variant="body1">
            <Link to={`/user-profile/${props.grader.id}`} className={classNames.textLink}>
              {props.grader.username}
            </Link>
          </Typography>
        </AlignedText>
        <AlignedText text="Student ID" maxWidth="lg" childrenType="text">
          <Typography variant="body1">{props.grader.student_id}</Typography>
        </AlignedText>
        <AlignedText text="Real Name" maxWidth="lg" childrenType="text">
          <Typography variant="body1">{props.grader.real_name}</Typography>
        </AlignedText>
      </SimpleBar>
    </>
  );
}
