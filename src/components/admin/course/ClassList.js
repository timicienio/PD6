import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Snackbar,
} from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import Icon from '../../ui/icon/index';
import { fetchClasses, addCourse, addClass } from '../../../actions/admin/course';
import { fetchClassMemberWithAccountReferral } from '../../../actions/common/common';
import CustomTable from '../../ui/CustomTable';
import AlignedText from '../../ui/AlignedText';
import PageTitle from '../../ui/PageTitle';
import NoMatch from '../../noMatch';
import GeneralLoading from '../../GeneralLoading';

/* This is a level 4 component (page component) */
export default function ClassList() {
  const { courseId, addType } = useParams();
  const history = useHistory();

  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const courses = useSelector((state) => state.courses);
  const classes = useSelector((state) => state.classes);

  const loading = useSelector((state) => state.loading.admin.course);
  const error = useSelector((state) => state.error.admin.course);

  const [addCourseName, setAddCourseName] = useState('');
  const [addClassName, setAddClassName] = useState('');

  const [showAddClassDialog, setShowAddClassDialog] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);

  useEffect(() => {
    if (!loading.addClass && !loading.renameClass && !loading.deleteClass) {
      dispatch(fetchClasses(authToken, courseId));
    }
  }, [authToken, courseId, dispatch, loading.addClass, loading.deleteClass, loading.renameClass]);

  // fetch members under all classes to get member count
  useEffect(() => {
    if (courses.byId[courseId] && !loading.renameClass && !loading.deleteClass && !loading.addClass) {
      courses.byId[courseId].classIds.map((id) => dispatch(fetchClassMemberWithAccountReferral(authToken, id)));
    }
  }, [authToken, courseId, courses.byId, dispatch, loading.addClass, loading.deleteClass, loading.renameClass]);

  const getCourseType = (courseType) => {
    switch (courseType) {
      case 'lesson':
        return 'Lesson';
      case 'contest':
        return 'Contest';
      default:
        return 'Unknown';
    }
  };

  const onClickAddClass = () => {
    setShowAddClassDialog(true);
  };
  const onClickSetting = () => {
    history.push(`/admin/course/course/${courseId}/setting`);
  };

  const addClassSuccess = () => {
    setAddClassName('');
    setShowAddClassDialog(false);
  };
  const addCourseSuccess = (newCourseId) => {
    setAddCourseName('');
    history.push(`/admin/course/course/${newCourseId}/class-list`);
  };
  const closeSnackbar = () => {
    setShowSnackBar(false);
  };

  const onAddCourse = (name) => {
    dispatch(
      addCourse(authToken, name, getCourseType(addType).toUpperCase(), addCourseSuccess, () => setShowSnackBar(true)),
    );
  };
  const onAddClass = (name) => {
    dispatch(addClass(authToken, courseId, name, addClassSuccess, () => setShowSnackBar(true)));
  };

  if (courses.byId[courseId] === undefined || courses.byId[courseId].name === undefined) {
    if (loading.fetchCourses) {
      // still loading
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle text={`${courses.byId[courseId].name}`} />
      <CustomTable
        searchPlaceholder="Class"
        buttons={(
          <>
            <Button onClick={onClickSetting}>Setting</Button>
            <Button color="primary" onClick={onClickAddClass}>
              <Icon.Add />
            </Button>
          </>
        )}
        data={
          courses.byId[courseId] !== undefined
            ? courses.byId[courseId].classIds.map((classId) => ({
              name: classes.byId[classId].name,
              memberCount: classes.byId[classId].memberIds.length,
              path: `/admin/course/class/${courseId}/${classId}/member`,
            }))
            : {}
        }
        columns={[
          {
            id: 'name',
            label: 'Class',
            minWidth: 100,
            width: 300,
            align: 'center',
          },
          {
            id: 'memberCount',
            label: 'Member Count',
            minWidth: 150,
            width: 150,
            align: 'center',
          },
        ]}
        hasLink
        linkName="path"
      />
      {/* add course is controlled by optional route param "addType" */}
      <Dialog open={addType !== undefined} maxWidth="md">
        <DialogTitle>
          <Typography variant="h4">Create a new course</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Type" maxWidth="md" childrenType="text">
            <Typography variant="body1">{getCourseType(addType)}</Typography>
          </AlignedText>
          <AlignedText text="Course Name" maxWidth="md" childrenType="field">
            <TextField value={addCourseName} onChange={(e) => setAddCourseName(e.target.value)} />
          </AlignedText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAddCourseName('');
              history.push(`/admin/course/course/${courseId}/class-list`);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onAddCourse(addCourseName)}
            color="primary"
            disabled={getCourseType(addType) === 'Unknown' || addCourseName === ''}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={addType !== undefined && showSnackBar}
        onClose={closeSnackbar}
        message={`Error: ${error.addCourse}`}
      />

      <Dialog open={showAddClassDialog || loading.addClass} maxWidth="md">
        <DialogTitle>
          <Typography variant="h4">Create a new class</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Type" childrenType="text">
            <Typography variant="body1">Lesson</Typography>
          </AlignedText>
          <AlignedText text="Course" childrenType="text">
            <Typography variant="body1">{courses.byId[courseId].name}</Typography>
          </AlignedText>
          <AlignedText text="Class Name" childrenType="field">
            <TextField value={addClassName} onChange={(e) => setAddClassName(e.target.value)} />
          </AlignedText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowAddClassDialog(false);
              setAddClassName('');
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => onAddClass(addClassName)}
            disabled={loading.addClass || addClassName === ''}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showAddClassDialog && showSnackBar}
        onClose={closeSnackbar}
        message={`Error: ${error.addClass}`}
      />
    </>
  );
}
