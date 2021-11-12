import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import AutoTable from '../../ui/AutoTable';
import { fetchProblems } from '../../../actions/common/common';

const useStyles = makeStyles(() => ({
  pageHeader: {
    marginBottom: '50px',
  },
}));

/* This is a level 4 component (page component) */
export default function ProblemList() {
  const classNames = useStyles();
  const { courseId, classId } = useParams();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const classes = useSelector((state) => state.classes);
  const courses = useSelector((state) => state.courses);
  const problems = useSelector((state) => state.problem);
  const error = useSelector((state) => state.error.common.common);

  return (
    <>
      <Typography className={classNames.pageHeader} variant="h3">
        {`${courses.byId[courseId] ? courses.byId[courseId].name : ''} / ${
          classes.byId[classId] ? classes.byId[classId].name : ''
        }`}
      </Typography>
      <AutoTable
        ident={`Problem Set ${classId}`}
        hasFilter
        filterConfig={[
          {
            reduxStateId: 'challenge_title',
            label: 'Challenge Title',
            type: 'TEXT',
            operation: 'LIKE',
          },
          {
            reduxStateId: 'challenge_label',
            label: 'Task Label',
            type: 'TEXT',
            operation: 'LIKE',
          },
          {
            reduxStateId: 'problem_title',
            label: 'Task Title',
            type: 'TEXT',
            operation: 'LIKE',
          },
        ]}
        defaultSort={['challenge_id', 'ASC']}
        refetch={(browseParams, ident) => {
          dispatch(fetchProblems(authToken, classId, browseParams, ident));
        }}
        refetchErrors={[error.fetchProblems]}
        columns={[
          {
            name: 'Score',
            align: 'center',
            type: 'string',
          },
          {
            name: 'Challenge Title',
            align: 'center',
            type: 'link',
          },
          {
            name: 'Task Label',
            align: 'center',
            type: 'string',
          },
          {
            name: 'Task Title',
            align: 'center',
            width: 'auto',
            type: 'string',
          },
        ]}
        reduxData={problems}
        reduxDataToRows={(item) => ({
          Score: '', // TODO: get score
          'Challenge Title': {
            text: item.challenge_title,
            path: `/problem-set/${courseId}/${classId}/challenge/${item.challenge_id}`,
          },
          'Task Label': item.challenge_label,
          'Task Title': item.problem_title,
          link: `/problem-set/${courseId}/${classId}/challenge/${item.challenge_id}/${item.problem_id}`,
        })}
        hasLink
      />
    </>
  );
}
