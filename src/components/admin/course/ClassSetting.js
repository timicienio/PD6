import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
} from '@material-ui/core';
import { renameClass, deleteClass } from '../../../actions/admin/course';
import SimpleBar from '../../ui/SimpleBar';
import AlignedText from '../../ui/AlignedText';
import PageTitle from '../../ui/PageTitle';
import NoMatch from '../../noMatch';

/* This is a level 4 component (page component) */
const ClassSetting = () => {
  const { courseId, classId } = useParams();
  const history = useHistory();

  const dispatch = useDispatch();
  // const thisState = useSelector((state) => state);
  const authToken = useSelector((state) => state.auth.token);
  const courses = useSelector((state) => state.courses);
  const classes = useSelector((state) => state.classes);
  const loading = useSelector((state) => state.loading.admin.course);
  const error = useSelector((state) => state.error.admin.course);

  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [showSnackBar, setShowSnackBar] = useState(false);

  const getCourseType = (courseType) => {
    switch (courseType) {
      case 'LESSON':
        return 'Lesson';
      case 'CONTEST':
        return 'Contest';
      default:
        return 'Unknown';
    }
  };

  const renameClassSuccess = () => {
    setNewClassName('');
    setShowRenameDialog(false);
  };
  const closeSnackbar = () => {
    setShowSnackBar(false);
  };

  const onRename = () => {
    dispatch(renameClass(authToken, classId, newClassName, renameClassSuccess, () => setShowSnackBar(true)));
  };
  const onDelete = () => {
    setShowDeleteDialog(false);
    dispatch(deleteClass(authToken, courseId, classId));
    history.push(`/admin/course/course/${courseId}/class-list/`);
  };

  if (courses.byId[courseId] === undefined || classes.byId[classId] === undefined) {
    if (loading.fetchCourses || loading.fetchClasses) {
      // still loading
      return <div>loading</div>;
    }
    return <NoMatch />;
  }

  return (
    <div className="class-setting">
      <PageTitle text={`${courses.byId[courseId].name} / ${classes.byId[classId].name} / Setting`} />
      <SimpleBar title="Course Information">
        <AlignedText text="Type" maxWidth="lg" childrenType="text">
          <Typography variant="body1">{getCourseType(courses.byId[courseId].type)}</Typography>
        </AlignedText>
        <AlignedText text="Course Name" maxWidth="lg" childrenType="text">
          <Typography variant="body1">{courses.byId[courseId].name}</Typography>
        </AlignedText>
        <AlignedText text="Class Name" maxWidth="lg" childrenType="text">
          <Typography variant="body1">{classes.byId[classId].name}</Typography>
        </AlignedText>
      </SimpleBar>

      <SimpleBar
        title="Rename Class"
        childrenButtons={(
          <>
            <Button onClick={() => setShowRenameDialog(true)} color="secondary">
              Rename
            </Button>
          </>
        )}
      >
        <Typography variant="body1">
          Once you change the class name, all related information will be affected. Please be certain.
        </Typography>
      </SimpleBar>

      <SimpleBar
        title="Delete Class"
        childrenButtons={(
          <>
            <Button onClick={() => setShowDeleteDialog(true)} color="secondary">
              Delete
            </Button>
          </>
        )}
      >
        <Typography variant="body1">Once you delete a class, there is no going back. Please be certain.</Typography>
      </SimpleBar>

      <Dialog open={showRenameDialog || loading.renameClass} maxWidth="md">
        <DialogTitle>
          <Typography variant="h4">Rename class</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Type" maxWidth="md" childrenType="text">
            <Typography variant="body1">{courses.byId[courseId].type}</Typography>
          </AlignedText>
          <AlignedText text="Course" maxWidth="md" childrenType="text">
            <Typography variant="body1">{courses.byId[courseId].name}</Typography>
          </AlignedText>
          <AlignedText text="Current Name" maxWidth="md" textColor="secondary" childrenType="text">
            <Typography variant="body1">{classes.byId[classId].name}</Typography>
          </AlignedText>
          <AlignedText text="New Name" maxWidth="md" childrenType="field">
            <TextField variant="outlined" onChange={(e) => setNewClassName(e.target.value)} />
          </AlignedText>
        </DialogContent>
        <DialogContent>
          <Typography variant="body2">
            Once you change class name, all related information will be affected. Please be certain.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowRenameDialog(false);
              setNewClassName('');
            }}
          >
            Cancel
          </Button>
          <Button onClick={onRename} color="secondary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showRenameDialog && showSnackBar}
        onClose={closeSnackbar}
        message={`Error: ${error.renameClass}`}
      />

      <Dialog open={showDeleteDialog || loading.deleteClass} maxWidth="md">
        <DialogTitle>
          <Typography variant="h4">Delete class</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Type" maxWidth="md" childrenType="text">
            <Typography variant="body1">{courses.byId[courseId].type}</Typography>
          </AlignedText>
          <AlignedText text="Course" maxWidth="md" childrenType="text">
            <Typography variant="body1">{courses.byId[courseId].name}</Typography>
          </AlignedText>
          <AlignedText text="Class" maxWidth="md" textColor="secondary" childrenType="text">
            <Typography variant="body1">{classes.byId[classId].name}</Typography>
          </AlignedText>
        </DialogContent>
        <DialogContent>
          <Typography variant="body2">Once you delete a class, there is no going back. Please be certain.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={onDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClassSetting;
