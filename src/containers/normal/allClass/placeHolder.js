import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Typography } from '@material-ui/core';

import { fetchClasses, fetchCourses } from '../../../actions/admin/course';

function PlaceHolder() {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const { courseId } = useParams();

  useEffect(() => {
    dispatch(fetchCourses(authToken));
  }, [authToken, dispatch]);

  useEffect(() => {
    if (courseId !== undefined) {
      dispatch(fetchClasses(authToken, courseId));
    }
  }, [authToken, courseId, dispatch]);

  if (courseId) {
    return <Typography variant="h3">Select a class...</Typography>;
  }
  return <Typography variant="h3">Select a course...</Typography>;
}

export default PlaceHolder;
