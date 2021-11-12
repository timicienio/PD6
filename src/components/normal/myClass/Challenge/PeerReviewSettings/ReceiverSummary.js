import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, makeStyles } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import { browsePeerReviewSummaryReceive } from '../../../../../actions/api/view';
import { browseAllPeerReviewReceive } from '../../../../../actions/myClass/peerReview';
import AutoTable from '../../../../ui/AutoTable';
import PageTitle from '../../../../ui/PageTitle';
import CopyToClipboardButton from '../../../../ui/CopyToClipboardButton';
import NoMatch from '../../../../noMatch';
import GeneralLoading from '../../../../GeneralLoading';

const useStyles = makeStyles(() => ({
  copyButton: {
    marginRight: '10px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
}));

const basicColumns1 = [
  {
    name: 'Receiver',
    align: 'center',
    minWidth: 139,
    type: 'link',
  },
  {
    name: 'Student ID',
    align: 'center',
    minWidth: 155,
    type: 'string',
  },
  {
    name: 'Real Name',
    align: 'center',
    minWidth: 144,
    type: 'string',
  },
];

const basicColumns2 = [
  {
    name: 'Average Score',
    align: 'center',
    minWidth: 160,
    type: 'string',
  },
];

/* This is a level 4 component (page component) */
// This page is only for class manager.
export default function PeerReviewSummary() {
  const {
    courseId, classId, challengeId, peerReviewId, is_null,
  } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const authToken = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.loading.api.view);
  const error = useSelector((state) => state.error.api.view);
  const challenges = useSelector((state) => state.challenges.byId);
  const PRsummary = useSelector((state) => state.peerReviewSummaryReceive);
  const peerReviews = useSelector((state) => state.peerReviews.byId);

  const [PRsummaryHTML, setPRsummaryHTML] = useState('');
  const [peerColumns, setPeerColumns] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (is_null !== undefined && Number(is_null) === 1) {
      setShowSnackbar(true);
    }
  }, [is_null]);

  useEffect(() => {
    dispatch(browseAllPeerReviewReceive(authToken, peerReviewId));
  }, [authToken, dispatch, peerReviewId]);

  useEffect(() => {
    const baseUrl = window.location.origin;
    let tableHTML = '<table>';
    if (PRsummary.allIds) {
      PRsummary.allIds.map((id) => {
        tableHTML += '<tr>';
        const profile = `${baseUrl}/user-profile/${PRsummary.byId[id].account_id}`;
        const peerData = [];
        Array(peerReviews[peerReviewId].max_review_count)
          .fill(0)
          .map((ID, index) => {
            peerData.push({
              text: PRsummary.byId[id].score[index] ? PRsummary.byId[id].score[index] : '',
              path: PRsummary.byId[id].peer_review_record_ids
                ? `${baseUrl}/my-class/${courseId}/${classId}/challenge/${challengeId}/peer-review/${peerReviewId}/receive/${PRsummary.byId[id].account_id}/${PRsummary.byId[id].peer_review_record_ids[index]}`
                : '',
            });
            return id;
          });
        tableHTML += `<td><a href=${profile}>${PRsummary.byId[id].username}</a></td>`;
        tableHTML += `<td>${PRsummary.byId[id].student_id}</td>`;
        tableHTML += `<td>${PRsummary.byId[id].real_name}</td>`;
        peerData.map((data) => {
          if (data.text !== '') {
            tableHTML += `<td><a href=${data.path}>${data.text}</a></td>`;
          } else {
            tableHTML += '<td></td>';
          }
          return data;
        });
        if (PRsummary.byId[id].average_score) {
          tableHTML += `<td>${PRsummary.byId[id].average_score}</td>`;
        } else {
          tableHTML += '<td></td>';
        }
        tableHTML += '</tr>';
        return PRsummary.byId[id];
      });
    }
    tableHTML += '</table>';
    setPRsummaryHTML(tableHTML);
  }, [PRsummary, challengeId, classId, courseId, peerReviewId, peerReviews]);

  useEffect(() => {
    if (peerReviews[peerReviewId] && peerReviews[peerReviewId].max_review_count) {
      setPeerColumns(
        Array(peerReviews[peerReviewId].max_review_count)
          .fill(0)
          .map((id, index) => ({
            name: `Peer ${index + 1}`,
            align: 'center',
            minWidth: 100,
            type: 'link',
          })),
      );
    }
  }, [peerReviewId, peerReviews]);

  if (PRsummary === undefined) {
    if (loading.browsePeerReviewSummaryReceive) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle
        text={`${challenges[challengeId].title} / ${peerReviews[peerReviewId].challenge_label} / Receiver Mode`}
      />
      <AutoTable
        ident={`${challenges[challengeId].title}-PR-receiver`}
        buttons={(
          <div className={classes.copyButton}>
            <CopyToClipboardButton text={PRsummaryHTML} />
          </div>
        )}
        hasFilter
        filterConfig={[
          {
            reduxStateId: 'username',
            label: 'Grader',
            type: 'TEXT',
            operation: 'LIKE',
          },
          {
            reduxStateId: 'student_id',
            label: 'Student ID',
            type: 'TEXT',
            operation: 'LIKE',
          },
          {
            reduxStateId: 'real_name',
            label: 'Real Name',
            type: 'TEXT',
            operation: 'LIKE',
          },
        ]}
        refetch={(browseParams, ident) => {
          dispatch(browsePeerReviewSummaryReceive(authToken, peerReviewId, browseParams, ident));
        }}
        refetchErrors={[error.browsePeerReviewSummaryReceive]}
        columns={basicColumns1.concat(peerColumns.concat(basicColumns2))}
        reduxData={PRsummary}
        reduxDataToRows={(item) => {
          const peerData = {};
          Array(peerReviews[peerReviewId].max_review_count)
            .fill(0)
            .map((id, index) => {
              peerData[`Peer ${index + 1}`] = {
                text: item.score[index] ? item.score[index] : '',
                path: item.peer_review_record_ids
                  ? `/my-class/${courseId}/${classId}/challenge/${challengeId}/peer-review/${peerReviewId}/receive/${item.account_id}/${item.peer_review_record_ids[index]}`
                  : '',
              };
              return id;
            });
          return {
            id: item.account_id,
            Receiver: {
              text: item.username,
              path: `/user-profile/${item.account_id}`,
            },
            'Student ID': item.student_id,
            'Real Name': item.real_name,
            'Average Score': item.average_score ? item.average_score : '',
            link:
              item.peer_review_record_ids.length !== 0 && item.peer_review_record_ids[0] !== null
                ? `/my-class/${courseId}/${classId}/challenge/${challengeId}/peer-review/${peerReviewId}/receive/${item.account_id}/${item.peer_review_record_ids[0]}`
                : `/my-class/${courseId}/${classId}/challenge/${challengeId}/peer-review/${peerReviewId}/receiver-summary/1`,
            ...peerData,
          };
        }}
        hasLink
      />
      <Snackbar
        open={showSnackbar}
        autoHideDuration={1500}
        onClose={() => {
          history.push(
            `/my-class/${courseId}/${classId}/challenge/${challengeId}/peer-review/${peerReviewId}/receiver-summary`,
          );
          setShowSnackbar(false);
        }}
        message={"Code hasn't been assigned to anyone yet."}
      />
    </>
  );
}
