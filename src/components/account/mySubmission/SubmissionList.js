import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { browseMySubmission } from '../../../actions/api/view';
import AutoTable from '../../ui/AutoTable';
import PageTitle from '../../ui/PageTitle';

export default function SubmissionList() {
  const dispatch = useDispatch();
  const submissions = useSelector((state) => state.submissions);
  const authToken = useSelector((state) => state.auth.token);
  const accountId = useSelector((state) => state.user.id);
  const viewError = useSelector((state) => state.error.api.view);
  const problems = useSelector((state) => state.problem);
  const challenges = useSelector((state) => state.challenges);
  const courses = useSelector((state) => state.courses);
  const classes = useSelector((state) => state.classes);
  const userClasses = useSelector((state) => state.user.classes);

  return (
    <>
      <PageTitle text="My Submission" />
      <AutoTable
        ident="My Submission"
        hasRefreshButton
        hasFilter
        filterConfig={[
          {
            reduxStateId: 'submission_id',
            label: 'Submission ID',
            type: 'TEXT',
            operation: '=',
          },
          {
            reduxStateId: 'course_id',
            label: 'Course',
            type: 'ENUM',
            operation: 'IN',
            options: [...new Map(userClasses.map((item) => ({
              value: item.course_id,
              label: item.course_name,
            })).map((item) => [item.value, item])).values()],
          },
          {
            reduxStateId: 'class_id',
            label: 'Class',
            type: 'ENUM',
            operation: 'IN',
            options: userClasses.map((item) => ({
              value: item.class_id,
              label: item.class_name,
            })),
          },
          {
            reduxStateId: 'challenge_title',
            label: 'Challenge',
            type: 'TEXT',
            operation: 'LIKE',
          },
          {
            reduxStateId: 'challenge_label',
            label: 'Task',
            type: 'TEXT',
            operation: 'LIKE',
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
        ]}
        refetch={(browseParams, ident) => {
          dispatch(browseMySubmission(authToken, accountId, browseParams, ident));
        }}
        refetchErrors={[viewError.browseMySubmission]}
        columns={[
          {
            name: 'Submission ID',
            align: 'center',
            type: 'string',
            minWidth: 150,
          },
          {
            name: 'Course',
            align: 'center',
            type: 'string',
            minWidth: 150,
          },
          {
            name: 'Class',
            align: 'center',
            type: 'link',
            minWidth: 150,
          },
          {
            name: 'Challenge',
            align: 'center',
            type: 'string',
            minWidth: 150,
          },
          {
            name: 'Task',
            align: 'center',
            type: 'link',
            minWidth: 150,
          },
          {
            name: 'Status',
            align: 'center',
            type: 'string',
            minWidth: 150,
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
            name: 'Submitted Time',
            align: 'center',
            type: 'string',
            minWidth: 150,
          },
        ]}
        reduxData={submissions}
        reduxDataToRows={(item) => ({
          id: item.id,
          'Submission ID': item.id,
          Course: courses.byId[item.course_id] ? courses.byId[item.course_id].name : '',
          Class: {
            text: classes.byId[item.class_id] ? classes.byId[item.class_id].name : '',
            path: `/${
              userClasses.filter((c) => c.class_id === item.class_id).length === 0 ? 'all-class' : 'my-class'
            }/${item.course_id}/${item.class_id}/challenge`,
          },
          Challenge: challenges.byId[item.challenge_id] ? challenges.byId[item.challenge_id].title : '',
          Task: {
            text: problems.byId[item.problem_id] ? problems.byId[item.problem_id].challenge_label : '',
            path: `/${
              userClasses.filter((c) => c.class_id === item.class_id).length === 0 ? 'all-class' : 'my-class'
            }/${item.course_id}/${item.class_id}/challenge/${item.challenge_id}/${item.problem_id}`,
          },
          Status: item.verdict === null ? 'Waiting For Judge' : item.verdict,
          'Submitted Time': moment(item.submit_time).format('YYYY-MM-DD, HH:mm'),
          link: `/my-submission/${item.course_id}/${item.class_id}/${item.challenge_id}/${item.problem_id}/${item.id}`,
        })}
        hasLink
      />
    </>
  );
}
