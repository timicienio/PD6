import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import AutoTable from '../../../ui/AutoTable';
import PageTitle from '../../../ui/PageTitle';
import { fetchChallenges } from '../../../../actions/myClass/challenge';
import GeneralLoading from '../../../GeneralLoading';
import NoMatch from '../../../noMatch';

/* This is a level 4 component (page component) */
export default function ChallengeList() {
  const { courseId, classId } = useParams();
  const dispatch = useDispatch();

  const authToken = useSelector((state) => state.auth.token);
  const error = useSelector((state) => state.error.myClass.challenge);
  const loading = useSelector((state) => state.loading.myClass.challenge);
  const commonLoading = useSelector((state) => state.loading.common.common);
  const challenges = useSelector((state) => state.challenges);
  const classes = useSelector((state) => state.classes.byId);
  const courses = useSelector((state) => state.courses.byId);

  const getStatus = (id) => {
    const currentTime = moment();
    if (currentTime.isBefore(moment(challenges.byId[id].start_time))) {
      return 'Not Yet';
    }
    if (currentTime.isBefore(moment(challenges.byId[id].end_time))) {
      return 'Opened';
    }
    return 'Closed';
  };

  if (courses[courseId] === undefined || classes[classId] === undefined) {
    if (commonLoading.fetchClass || commonLoading.fetchCourse) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle text={`${courses[courseId].name} ${classes[classId].name} / Challenge`} />
      <AutoTable
        ident={`Challenge list ${classId}`}
        hasFilter
        filterConfig={[
          {
            reduxStateId: 'title',
            label: 'Title',
            type: 'TEXT',
            operation: 'LIKE',
          },
          {
            reduxStateId: 'status',
            label: 'Status',
            type: 'ENUM_SINGLE',
            operation: 'IN',
            options: [
              { value: 'Not Yet', label: 'Not Yet' },
              { value: 'Opened', label: 'Opened' },
              { value: 'Closed', label: 'Closed' },
            ],
          },
        ]}
        defaultSort={['start_time', 'DESC']}
        refetch={(browseParams, ident) => {
          dispatch(fetchChallenges(authToken, classId, browseParams, ident));
        }}
        refetchErrors={[error.fetchChallenges]}
        refreshLoadings={[loading.addChallenge]}
        columns={[
          {
            name: 'Title',
            align: 'center',
            width: 300,
            minWidth: 150,
            type: 'string',
          },
          {
            name: 'Start Time',
            align: 'center',
            width: 200,
            minWidth: 50,
            type: 'string',
          },
          {
            name: 'End Time',
            align: 'center',
            width: 200,
            minWidth: 50,
            type: 'string',
          },
          {
            name: 'Status',
            align: 'center',
            width: 132,
            minWidth: 50,
            type: 'string',
          },
        ]}
        reduxData={challenges}
        reduxDataToRows={(item) => ({
          id: item.id,
          Title: item.title,
          'Start Time': moment(item.start_time).format('YYYY-MM-DD, HH:mm'),
          'End Time': moment(item.end_time).format('YYYY-MM-DD, HH:mm'),
          Status: getStatus(item.id),
          link: `/all-class/${courseId}/${classId}/challenge/${item.id}`,
        })}
        hasLink
      />
    </>
  );
}
