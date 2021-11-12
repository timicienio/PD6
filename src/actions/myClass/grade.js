import agent from '../agent';
import { gradeConstants } from './constant';

// fetch single grade
export const fetchGrade = (token, gradeId) => async (dispatch) => {
  try {
    const config1 = { headers: { 'auth-token': token } };
    dispatch({ type: gradeConstants.FETCH_GRADE_START });
    const res1 = await agent.get(`grade/${gradeId}`, config1);
    const { data } = res1.data;

    // get receiver and grader account
    const config2 = {
      headers: { 'auth-token': token },
      params: { account_ids: JSON.stringify([data.receiver_id, data.grader_id]) },
    };

    const res2 = await agent.get('/account-summary/batch', config2);

    dispatch({
      type: gradeConstants.FETCH_GRADE_SUCCESS,
      payload: {
        gradeId,
        data,
        accounts: res2.data.data,
      },
    });
  } catch (error) {
    dispatch({
      type: gradeConstants.FETCH_GRADE_FAIL,
      error,
    });
  }
};

export const deleteGrade = (token, gradeId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: gradeConstants.DELETE_GRADE_START });
    await agent.delete(`/grade/${gradeId}`, config);
    dispatch({ type: gradeConstants.DELETE_GRADE_SUCCESS });
  } catch (error) {
    dispatch({
      type: gradeConstants.DELETE_GRADE_FAIL,
      error,
    });
  }
};

export const editGrade = (token, gradeId, title, score, comment) => (dispatch) => {
  const config = { headers: { 'auth-token': token } };
  dispatch({ type: gradeConstants.EDIT_GRADE_START });
  agent
    .patch(`/grade/${gradeId}`, { title, score, comment }, config)
    .then(() => {
      dispatch({ type: gradeConstants.EDIT_GRADE_SUCCESS });
    })
    .catch((error) => {
      dispatch({
        type: gradeConstants.EDIT_GRADE_FAIL,
        error,
      });
    });
};

export const addClassGrade = (token, classId, receiverRef, graderRef, title, score, comment) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    const body = {
      receiver_referral: receiverRef,
      grader_referral: graderRef,
      title,
      score,
      comment,
    };
    dispatch({ type: gradeConstants.ADD_CLASS_GRADE_START });
    await agent.post(`/class/${classId}/grade`, body, config);
    dispatch({ type: gradeConstants.ADD_CLASS_GRADE_SUCCESS });
  } catch (error) {
    dispatch({
      type: gradeConstants.ADD_CLASS_GRADE_FAIL,
      error,
    });
  }
};

export const importClassGrade = (token, classId, title, file) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
        'Content-Type': 'multipart/form-data',
      },
      params: {
        title,
      },
    };
    const formData = new FormData();
    formData.append('grade_file', file);

    dispatch({ type: gradeConstants.IMPORT_CLASS_GRADE_START });
    await agent.post(`/class/${classId}/grade-import`, formData, config);
    dispatch({ type: gradeConstants.IMPORT_CLASS_GRADE_SUCCESS });
  } catch (error) {
    dispatch({
      type: gradeConstants.IMPORT_CLASS_GRADE_FAIL,
      error,
    });
  }
};

// WITH BROWSE PARAMS
// export const fetchAccountGrade = (token, accountId) => (dispatch) => {
//   const config = { headers: { 'auth-token': token } };
//   dispatch({ type: gradeConstants.FETCH_ACCOUNT_GRADE_START });
//   agent
//     .get(`/account/${accountId}/grade`, config)
//     .then((res) => {
//       dispatch({
//         type: gradeConstants.FETCH_ACCOUNT_GRADE_SUCCESS,
//         payload: { accountId, data: res.data.data.data },
//       });
//     })
//     .catch((error) => {
//       dispatch({
//         type: gradeConstants.FETCH_ACCOUNT_GRADE_FAIL,
//         error,
//       });
//     });
// };

export const downloadGradeFile = (token) => async (dispatch) => {
  try {
    const config1 = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: gradeConstants.DOWNLOAD_GRADE_FILE_START });
    const res = await agent.get('/grade/template', config1);

    const config2 = {
      headers: {
        'auth-token': token,
      },
      params: {
        filename: res.data.data.filename,
        as_attachment: true,
      },
    };
    const res2 = await agent.get(`/s3-file/${res.data.data.s3_file_uuid}/url`, config2);

    fetch(res2.data.data.url).then((t) => t.blob().then((b) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.setAttribute('download', res.data.data.filename);
      a.click();
    }));

    dispatch({
      type: gradeConstants.DOWNLOAD_GRADE_FILE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: gradeConstants.DOWNLOAD_GRADE_FILE_FAIL,
      error,
    });
  }
};
