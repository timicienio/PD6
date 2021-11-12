import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import moment from 'moment';

// import DateRangePicker from '../../../ui/DateRangePicker';
import { fetchAllChallengesProblems } from '../../../../actions/common/common';
import { browseSubmissionUnderClass } from '../../../../actions/api/view';
import AutoTable from '../../../ui/AutoTable';
import PageTitle from '../../../ui/PageTitle';

import NoMatch from '../../../noMatch';
import GeneralLoading from '../../../GeneralLoading';

/* This is a level 4 component (page component) */
export default function SubmissionList() {
  const { courseId, classId } = useParams();
  const classes = useSelector((state) => state.classes);
  const courses = useSelector((state) => state.courses);
  // const loading = useSelector((state) => state.loading);
  const viewError = useSelector((state) => state.error.api.view);
  const commonLoading = useSelector((state) => state.loading.common.common);
  const submissions = useSelector((state) => state.submissions);
  const accounts = useSelector((state) => state.accounts);
  const challenges = useSelector((state) => state.challenges);
  const problems = useSelector((state) => state.problem);
  const authToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllChallengesProblems(authToken, classId));
  }, [authToken, classId, dispatch]);

  if (courses.byId[courseId] === undefined || classes.byId[classId] === undefined) {
    if (commonLoading.fetchCourse || commonLoading.fetchClass) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle text={`${courses.byId[courseId].name} ${classes.byId[classId].name} / Submission`} />
      <AutoTable
        ident={`Class Submission Table ${classId}`}
        hasFilter
        filterConfig={[
          {
            reduxStateId: 'submission_id',
            label: 'ID',
            type: 'TEXT',
            operation: '=',
          },
          {
            reduxStateId: 'username',
            label: 'Username',
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

          {
            reduxStateId: 'challenge_id',
            label: 'Challenge',
            type: 'ENUM',
            operation: 'IN',
            options: classes.byId[classId].challengeIds.map((id) => ({
              value: id,
              label: challenges.byId[id].title,
            })),
          },
          {
            reduxStateId: 'problem_id',
            label: 'Problem',
            type: 'ENUM',
            operation: 'IN',
            options: classes.byId[classId].challengeIds
              .map((id) => problems.allIds.filter((problemId) => problems.byId[problemId].challenge_id === id))
              .flat()
              .map((problemId) => ({
                value: problemId,
                label: `${challenges.byId[problems.byId[problemId].challenge_id].title} ${problems.byId[problemId].challenge_label}`,
              })),

          },
          {
            reduxStateId: 'verdict',
            label: 'Status',
            type: 'ENUM',
            operation: 'IN',
            options: [
              { value: 'ACCEPTED', label: 'Accepted' },
              { value: 'WRONG ANSWER', label: 'Wrong Answer' },
              { value: 'MEMORY LIMIT EXCEED', label: 'Memory Limit Exceed' },
              { value: 'TIME LIMIT EXCEED', label: 'Time Limit Exceed' },
              { value: 'RUNTIME ERROR', label: 'Runtime Error' },
              { value: 'COMPILE ERROR', label: 'Compile Error' },
              { value: 'CONTACT MANAGER', label: 'Contact Manager' },
              { value: 'FORBIDDEN ACTION', label: 'Restricted Action' },
              { value: 'SYSTEM ERROR', label: 'System Error' },
            ],
          },
          // {
          //   reduxStateId: 'submit_time',
          //   label: 'Time',
          //   type: 'DATE',
          //   operation: 'LIKE',
          // },
        ]}
        refetch={(browseParams, ident) => {
          dispatch(browseSubmissionUnderClass(authToken, classId, browseParams, ident));
        }}
        refetchErrors={[viewError.browseSubmissionUnderClass]}
        columns={[
          {
            name: 'ID',
            width: 140.5,
            minWidth: 140.5,
            align: 'center',
            type: 'string',
          },
          {
            name: 'Username',
            width: 140.5,
            minWidth: 140.5,
            align: 'center',
            type: 'link',
          },
          {
            name: 'Student ID',
            width: 140.5,
            minWidth: 140.5,
            align: 'center',
            type: 'string',
          },
          {
            name: 'Real Name',
            width: 140.5,
            minWidth: 140.5,
            align: 'center',
            type: 'string',
          },
          {
            name: 'Challenge',
            width: 140.5,
            minWidth: 140.5,
            align: 'center',
            type: 'link',
          },
          {
            name: 'Problem',
            width: 140.5,
            minWidth: 140.5,
            align: 'center',
            type: 'link',
          },
          {
            name: 'Status',
            width: 140.5,
            minWidth: 140.5,
            align: 'center',
            type: 'string',
            colors: {
              'Waiting for judge': 'default',
              'No Status': 'error',
              Accepted: 'accepted',
              'Wrong Answer': 'error',
              'Memory Limit Exceed': 'error',
              'Time Limit Exceed': 'error',
              'Runtime Error': 'error',
              'Compile Error': 'error',
              'Contact Manager': 'error',
              'Forbidden Action': 'error',
              'System Error': 'error',
            },
          },
          {
            name: 'Time',
            width: 140.5,
            minWidth: 140.5,
            align: 'center',
            type: 'string',
          },
        ]}
        reduxData={submissions}
        reduxDataToRows={(item) => ({
          id: item.id,
          ID: item.id,
          Username: {
            text: accounts.byId[item.account_id] ? accounts.byId[item.account_id].username : '',
            path: accounts.byId[item.account_id] ? `/user-profile/${accounts.byId[item.account_id].id}` : '',
          },
          'Student ID': accounts.byId[item.account_id] ? accounts.byId[item.account_id].student_id : '',
          'Real Name': accounts.byId[item.account_id] ? accounts.byId[item.account_id].real_name : '',
          Challenge: {
            text:
              problems.byId[item.problem_id] && challenges.byId[problems.byId[item.problem_id].challenge_id]
                ? challenges.byId[problems.byId[item.problem_id].challenge_id].title
                : '',
            path: problems.byId[item.problem_id]
              ? `/my-class/${courseId}/${classId}/challenge/${problems.byId[item.problem_id].challenge_id}`
              : '',
          },
          Problem: {
            text: problems.byId[item.problem_id] ? problems.byId[item.problem_id].challenge_label : '',
            path: problems.byId[item.problem_id]
              ? `/my-class/${courseId}/${classId}/challenge/${problems.byId[item.problem_id].challenge_id}/${
                item.problem_id
              }`
              : '',
          },
          Status: item.verdict !== null ? item.verdict : 'Waiting for judge',
          Time: moment(item.submit_time).format('YYYY-MM-DD, HH:mm:ss'),
          link: `/my-class/${courseId}/${classId}/submission/${item.id}`,
        })}
        hasLink
        hasRefreshButton
      />
    </>
  );
}
