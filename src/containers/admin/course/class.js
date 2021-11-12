import React, { useEffect } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MemberList from '../../../components/admin/course/MemberList';
import ClassSetting from '../../../components/admin/course/ClassSetting';
import NoMatch from '../../../components/noMatch';
import { fetchCourse, fetchClass } from '../../../actions/common/common';

/* This is a level 3 container (main page container) */
export default function Class() {
  const { courseId, classId } = useParams();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);
  const authToken = useSelector((state) => state.auth.token);
  useEffect(() => {
    if (!loading.admin.course.addCourse && !loading.admin.course.deleteCourse && !loading.admin.course.renameCourse) {
      dispatch(fetchCourse(authToken, courseId));
    }
  }, [
    authToken,
    classId,
    courseId,
    dispatch,
    loading.addCourse,
    loading.admin.course.addCourse,
    loading.admin.course.deleteCourse,
    loading.admin.course.renameCourse,
    loading.deleteCourse,
    loading.renameCourse,
  ]);

  useEffect(() => {
    if (
      !loading.admin.course.addClass
      && !loading.admin.course.renameClass
      && !loading.admin.course.deleteClass
      && !loading.admin.course.editMembers
    ) {
      dispatch(fetchClass(authToken, classId));
    }
  }, [
    authToken,
    classId,
    dispatch,
    loading.admin.course.addClass,
    loading.admin.course.deleteClass,
    loading.admin.course.editMembers,
    loading.admin.course.renameClass,
  ]);

  return (
    <>
      <Switch>
        <Route path="/admin/course/class/:courseId/:classId/member" component={MemberList} />
        <Route path="/admin/course/class/:courseId/:classId/setting" component={ClassSetting} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}
