import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';

import PageTitle from '../ui/PageTitle';
import SimpleBar from '../ui/SimpleBar';
import AlignedText from '../ui/AlignedText';
import GeneralLoading from '../GeneralLoading';
import NoMatch from '../noMatch';

/* This is a level 3 component (page component) */

export default function Profile({ accountId }) {
  const accounts = useSelector((state) => state.accounts.byId);
  const loading = useSelector((state) => state.loading.user.user);

  if (accounts[accountId] === undefined) {
    if (loading.readOthersAccount) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle text={`${accounts[accountId].username} / Profile`} />
      <SimpleBar
        title="Basic Information"
      >
        <>
          <AlignedText text="Username" childrenType="text">
            <Typography variant="body1">{accounts[accountId].username}</Typography>
          </AlignedText>
          <AlignedText text="Real name" childrenType="text">
            <Typography variant="body1">{accounts[accountId].real_name}</Typography>
          </AlignedText>
          <AlignedText text="Nickname" childrenType="text">
            <Typography variant="body1">{accounts[accountId].nickname}</Typography>
          </AlignedText>
        </>
      </SimpleBar>
    </>
  );
}
