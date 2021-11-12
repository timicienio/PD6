import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Drawer, Typography, List, ListItem, ListItemIcon, ListItemText, Divider,
} from '@material-ui/core';
import Icon from '../icon/index';

import { fetchCourses, fetchClasses } from '../../../actions/admin/course';

export default function ProblemSet({
  classNames, history, location, mode, open, onClose,
}) {
  const { courseId: currentCourseId, classId: currentClassId } = useParams();
  const baseURL = '/problem-set';
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const classes = useSelector((state) => state.classes);
  const courses = useSelector((state) => state.courses);
  const [display, setDisplay] = useState([]); // 0: fold, 1: unfold

  useEffect(() => {
    if (courses.allIds.length > 0) {
      courses.allIds.map((id) => dispatch(fetchClasses(authToken, id)));
    }
  }, [authToken, courses.allIds, dispatch]);

  useEffect(() => {
    dispatch(fetchCourses(authToken));
  }, [authToken, dispatch]);

  useEffect(() => {
    if (currentCourseId !== undefined && currentClassId !== undefined) return;
    const defaultCourseId = courses.allIds[0];
    if (courses.byId[defaultCourseId]) {
      const relatedClassIds = courses.byId[defaultCourseId].classIds;
      if (relatedClassIds && relatedClassIds.length > 0) {
        const defaultClassId = relatedClassIds[0];
        history.push(`${baseURL}/${defaultCourseId}/${defaultClassId}`);
      }
    }
  }, [courses, currentClassId, currentCourseId, history]);

  // has course and class id in url
  useEffect(() => {
    const foldIndex = courses.allIds.indexOf(Number(currentCourseId));
    if (foldIndex !== -1) {
      const newList = display.length > 0 ? [...display] : courses.allIds.map(() => 0);
      if (newList[foldIndex] !== 1) {
        newList[foldIndex] = 1;
        setDisplay(newList);
      }
    }
  }, [courses.allIds, currentCourseId, display]);

  const changeFoldCourse = (id) => {
    const newList = [...display];
    newList[id] = !newList[id];
    setDisplay(newList);
  };

  return (
    <div>
      <Drawer
        variant="persistent"
        open={open}
        onClose={onClose}
        className={classNames.drawer}
        anchor="left"
        PaperProps={{ elevation: 5 }}
        classes={{ paper: classNames.drawerPaper }}
      >
        <div className={classNames.topSpace} />
        <div>
          {courses.allIds.map((courseId, id) => (
            <div key={courseId}>
              <div className={classNames.title}>
                {display[id] ? (
                  <Icon.TriangleDown className={classNames.titleIcon} onClick={() => changeFoldCourse(id)} />
                ) : (
                  <Icon.TriangleRight className={classNames.titleIcon} onClick={() => changeFoldCourse(id)} />
                )}
                <Typography noWrap variant="h4" className={classNames.titleText}>
                  {courses.byId[courseId].name}
                </Typography>
              </div>
              <Divider variant="middle" className={classNames.divider} />
              {Boolean(display[id]) && (
                <List>
                  {courses.byId[courseId].classIds.map((classId) => (
                    <ListItem
                      button
                      key={classId}
                      className={
                        location.pathname === `${baseURL}/${courseId}/${classId}`
                          ? `${classNames.active} ${classNames.item}`
                          : classNames.item
                      }
                      onClick={() => history.push(`${baseURL}/${courseId}/${classId}`)}
                    >
                      <ListItemIcon className={classNames.itemIcon}>
                        <Icon.Challenge />
                      </ListItemIcon>
                      <ListItemText primary={classes.byId[classId].name} className={classNames.itemText} />
                    </ListItem>
                  ))}
                </List>
              )}
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
