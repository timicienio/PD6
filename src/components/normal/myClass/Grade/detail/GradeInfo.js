import React from 'react';
import { makeStyles, Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import SimpleBar from '../../../../ui/SimpleBar';
import AlignedText from '../../../../ui/AlignedText';

const useStyles = makeStyles((theme) => ({
  textLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}));

export default function GradeInfo(props) {
  const classNames = useStyles();

  return (
    <div>
      <SimpleBar
        title="Grade Information"
        buttons={
          props.isManager && (
            <>
              <Button onClick={() => props.handleEdit()}>Edit</Button>
            </>
          )
        }
      >
        <>
          <AlignedText text="Username" maxWidth="lg" childrenType="text">
            <Typography variant="body1">
              <Link to={`/user-profile/${props.receiver.id}`} className={classNames.textLink}>
                {props.receiver.username}
              </Link>
            </Typography>
          </AlignedText>
          <AlignedText text="Student ID" maxWidth="lg" childrenType="text">
            <Typography variant="body1">{props.receiver.student_id}</Typography>
          </AlignedText>
          <AlignedText text="Real Name" maxWidth="lg" childrenType="text">
            <Typography variant="body1">{props.receiver.real_name}</Typography>
          </AlignedText>
          <AlignedText text="Title" maxWidth="lg" childrenType="text">
            <Typography variant="body1">{props.grade.title}</Typography>
          </AlignedText>
          <AlignedText text="Score" maxWidth="lg" childrenType="text">
            <Typography variant="body1">{props.grade.score}</Typography>
          </AlignedText>
          <AlignedText text="Comment" maxWidth="lg" childrenType="text">
            <Typography variant="body1">{props.grade.comment}</Typography>
          </AlignedText>
          <AlignedText text="Submitted Time" maxWidth="lg" childrenType="text">
            <Typography variant="body1">{moment(props.grade.update_time).format('YYYY-MM-DD, HH:mm')}</Typography>
          </AlignedText>
        </>
      </SimpleBar>
    </div>
  );
}
