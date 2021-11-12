import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';

import AlignedText from '../../../../ui/AlignedText';
import SimpleBar from '../../../../ui/SimpleBar';
import PageTitle from '../../../../ui/PageTitle';

import BasicInfo from './Element/BasicInfo';
import ReceiverInfo from './Element/ReceiverInfo';
import GraderInfo from './Element/GraderInfo';
import CodeArea from '../../../../ui/CodeArea';
import NoMatch from '../../../../noMatch';
import GeneralLoading from '../../../../GeneralLoading';

import { browseAccountReceivedPeerReviewRecord } from '../../../../../actions/api/peerReview';
import { readPeerReviewRecordWithCode } from '../../../../../actions/myClass/peerReview';

/* This is a level 4 component (page component) */
// This page is for both normal and manager.
// Render different component according to role and call correct api.
// If normal, account id should be himself.
export default function ReviewedRecord() {
  const {
    classId, challengeId, peerReviewId, accountId, recordId,
  } = useParams();
  const dispatch = useDispatch();
  const [role, setRole] = useState('GUEST');
  const [peerId, setPeerId] = useState(-1);

  const authToken = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.loading.api.peerReview);
  const pageLoading = useSelector((state) => state.loading.myClass.peerReview);
  // const error = useSelector((state) => state.error.api.peerReviews);
  const commonLoading = useSelector((state) => state.loading.common.common);
  const userClasses = useSelector((state) => state.user.classes);
  const challenges = useSelector((state) => state.challenges.byId);
  const peerReviews = useSelector((state) => state.peerReviews.byId);
  const peerReviewRecords = useSelector((state) => state.peerReviewRecords.byId);

  useEffect(() => {
    if (peerReviews[peerReviewId] !== undefined) {
      const id = peerReviews[peerReviewId].receiveRecordIds.findIndex((element) => element === Number(recordId));
      if (id !== -1) {
        setPeerId(id + 1);
      }
    }
  }, [peerReviewId, peerReviews, recordId]);

  useEffect(() => {
    const newRole = userClasses.filter((item) => item.class_id === Number(classId))[0].role;
    if (newRole !== null || newRole !== undefined) {
      setRole(newRole);
    }
  }, [classId, userClasses]);

  useEffect(() => {
    // dispatch read receive ids for this account
    dispatch(browseAccountReceivedPeerReviewRecord(authToken, peerReviewId, accountId));
    // dispatch read record with code
    dispatch(readPeerReviewRecordWithCode(authToken, recordId));
  }, [accountId, authToken, dispatch, peerReviewId, recordId]);

  if (
    challenges[challengeId] === undefined
    || peerReviews[peerReviewId] === undefined
    || peerReviewRecords[recordId] === undefined
  ) {
    // console.log(loading);
    if (commonLoading.fetchChallenge || loading.readPeerReviewWithProblem || pageLoading.readPeerReviewRecord) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  if (role === 'GUEST' || peerId === -1) {
    return <NoMatch />;
  }

  return (
    <>
      {role === 'MANAGER' ? (
        <PageTitle text={`Peer Review Detail / Peer ${peerId}`} />
      ) : (
        <PageTitle text={`Received Peer Review Detail / Peer ${peerId}`} />
      )}

      <BasicInfo />

      {role === 'MANAGER' && (
        <>
          <ReceiverInfo accountId={peerReviewRecords[recordId].receiver_id} />
          <GraderInfo
            accountId={peerReviewRecords[recordId].grader_id}
            reviewedTime={peerReviewRecords[recordId].submit_time}
          />
        </>
      )}

      <SimpleBar title="Code" noIndent>
        <CodeArea value={peerReviewRecords[recordId].code} />
      </SimpleBar>
      {role === 'MANAGER' && (
        <>
          <SimpleBar title="Score">
            {peerReviewRecords[recordId].score === null ? '' : peerReviewRecords[recordId].score}
          </SimpleBar>
          <SimpleBar title="Comment">
            {peerReviewRecords[recordId].comment === null ? '' : peerReviewRecords[recordId].comment}
          </SimpleBar>
        </>
      )}
      {role === 'NORMAL' && (
        <>
          <SimpleBar title="Review">
            <AlignedText text="Score" childrenType="text">
              <Typography variant="body1">
                {peerReviewRecords[recordId].score === null ? '' : peerReviewRecords[recordId].score}
              </Typography>
            </AlignedText>
            <AlignedText text="Comment" childrenType="text">
              <Typography variant="body1">
                {peerReviewRecords[recordId].comment === null ? '' : peerReviewRecords[recordId].comment}
              </Typography>
            </AlignedText>
          </SimpleBar>
        </>
      )}
    </>
  );
}
