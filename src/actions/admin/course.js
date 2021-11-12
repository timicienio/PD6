import agent from '../agent';
import { courseConstants } from './constant';

export const fetchCourses = (token) => (dispatch) => {
  const config = { headers: { 'auth-token': token } };

  dispatch({
    type: courseConstants.FETCH_COURSES_START,
  });

  agent
    .get('/course', config)
    .then((res) => {
      const { data } = res.data;
      dispatch({
        type: courseConstants.FETCH_COURSES_SUCCESS,
        payload: { data },
      });
    })
    .catch((error) => {
      dispatch({ type: courseConstants.FETCH_COURSES_FAIL, error });
    });
};

export const addCourse = (token, name, type, onSuccess, onError) => async (dispatch) => {
  try {
    const config = { headers: { 'auth-token': token } };
    const body = { name, type };
    dispatch({ type: courseConstants.ADD_COURSE_START });
    const res = await agent.post('/course', body, config);
    dispatch({ type: courseConstants.ADD_COURSE_SUCCESS });
    onSuccess(res.data.data.id);
  } catch (error) {
    dispatch({
      type: courseConstants.ADD_COURSE_FAIL,
      error,
    });
    onError();
  }
};

export const renameCourse = (token, courseId, name, onSuccess, onError) => async (dispatch) => {
  try {
    const config = { headers: { 'auth-token': token } };
    dispatch({ type: courseConstants.RENAME_COURSE_START });
    await agent.patch(`/course/${courseId}`, { name }, config);
    dispatch({ type: courseConstants.RENAME_COURSE_SUCCESS });
    onSuccess();
  } catch (error) {
    dispatch({
      type: courseConstants.RENAME_COURSE_FAIL,
      error,
    });
    onError();
  }
};

export const deleteCourse = (token, courseId) => (dispatch) => {
  const config = { headers: { 'auth-token': token } };
  dispatch({
    type: courseConstants.DELETE_COURSE_START,
  });

  agent
    .delete(`/course/${courseId}`, config)
    .then(() => {
      dispatch({
        type: courseConstants.DELETE_COURSE_SUCCESS,
        payload: {
          courseId,
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: courseConstants.DELETE_COURSE_FAIL,
        error,
      });
    });
};

export const fetchClasses = (token, courseId) => (dispatch) => {
  const config = { headers: { 'auth-token': token } };

  dispatch({ type: courseConstants.FETCH_CLASSES_START });

  agent
    .get(`/course/${courseId}/class`, config)
    .then((res) => {
      dispatch({
        type: courseConstants.FETCH_CLASSES_SUCCESS,
        payload: { courseId, data: res.data },
      });
    })
    .catch((error) => {
      dispatch({ type: courseConstants.FETCH_CLASSES_FAIL, error });
    });
};

export const addClass = (token, courseId, name, onSuccess, onError) => async (dispatch) => {
  try {
    const config = {
      headers: { 'auth-token': token },
      params: { course_id: courseId },
    };
    dispatch({ type: courseConstants.ADD_CLASS_START });
    await agent.post(`/course/${courseId}/class`, { name }, config);
    dispatch({ type: courseConstants.ADD_CLASS_SUCCESS });
    onSuccess();
  } catch (error) {
    dispatch({
      type: courseConstants.ADD_CLASS_FAIL,
      error,
    });
    onError();
  }
};

export const renameClass = (token, classId, name, onSuccess, onError) => async (dispatch) => {
  try {
    const config = { headers: { 'auth-token': token } };
    dispatch({ type: courseConstants.RENAME_CLASS_START });
    await agent.patch(`/class/${classId}`, { name }, config);
    dispatch({ type: courseConstants.RENAME_CLASS_SUCCESS });
    onSuccess();
  } catch (error) {
    dispatch({
      type: courseConstants.RENAME_CLASS_FAIL,
      error,
    });
    onError();
  }
};

export const deleteClass = (token, courseId, classId) => (dispatch) => {
  const config = { headers: { 'auth-token': token } };
  dispatch({
    type: courseConstants.DELETE_CLASS_START,
  });

  agent
    .delete(`/class/${classId}`, config)
    .then(() => {
      dispatch({
        type: courseConstants.DELETE_CLASS_SUCCESS,
        payload: {
          courseId,
          classId,
        },
      });
    })
    .catch((error) => {
      dispatch({
        type: courseConstants.DELETE_CLASS_FAIL,
        error,
      });
    });
};
