import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';

import AlignedText from '../../../../../ui/AlignedText';
import SimpleBar from '../../../../../ui/SimpleBar';

const useStyles = makeStyles((theme) => ({
  textLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
}));

export default function GraderInfo({ accountId, reviewedTime }) {
  const classNames = useStyles();
  const accounts = useSelector((state) => state.accounts.byId);

  if (accounts[accountId] === undefined) {
    return <></>;
  }

  return (
    <SimpleBar title="Grader">
      <>
        <AlignedText text="Username" childrenType="text">
          <Typography variant="body1">
            <Link to={`/user-profile/${accountId}`} className={classNames.textLink}>
              {accounts[accountId].username}
            </Link>
          </Typography>
        </AlignedText>
        <AlignedText text="Student ID" childrenType="text">
          <Typography variant="body1">
            {accounts[accountId].student_id}
          </Typography>
        </AlignedText>
        <AlignedText text="Real Name" childrenType="text">
          <Typography variant="body1">
            {accounts[accountId].real_name}
          </Typography>
        </AlignedText>
        <AlignedText text="Reviewed Time" childrenType="text">
          <Typography variant="body1">
            {reviewedTime && moment(reviewedTime).format('YYYY-MM-DD, HH:mm')}
          </Typography>
        </AlignedText>
      </>
    </SimpleBar>
  );
}
