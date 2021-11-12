import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import SimpleBar from '../../../../../ui/SimpleBar';
import SimpleTable from '../../../../../ui/SimpleTable';

/* This is a level 4 component (page component) */
// This page is for normal.
export default function Overview({ peerReviewId }) {
  const peerReviewRecords = useSelector((state) => state.peerReviewRecords);
  const peerReviews = useSelector((state) => state.peerReviews.byId);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (peerReviews[peerReviewId]) {
      const newTableData = peerReviews[peerReviewId].reviewRecordIds.sort((a, b) => a - b).map((id, i) => {
        const item = peerReviewRecords.byId[id];
        return ({
          id: `Peer${i + 1}`,
          peer: `Peer${i + 1}`,
          status: item && item.submit_time !== null ? 'Done' : 'Not Yet',
        });
      });
      setTableData(newTableData);
    }
  }, [peerReviewId, peerReviewRecords.byId, peerReviews]);

  return (
    <>
      <SimpleBar title="Overview" noIndent>
        <SimpleTable
          isEdit={false}
          hasDelete={false}
          columns={[
            {
              id: 'peer',
              label: 'Peer',
              minWidth: 50,
              align: 'center',
              width: 60,
              type: 'string',
            },
            {
              id: 'status',
              label: 'Status',
              minWidth: 50,
              align: 'center',
              width: 60,
              type: 'string',
            },
          ]}
          data={tableData}
        />
      </SimpleBar>
    </>
  );
}
