import agent from '../agent';
import { essayConstants } from './constant';

const readEssay = (token, essayId) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  try {
    dispatch({ type: essayConstants.READ_ESSAY_START });
    const res = await agent.get(`/essay/${essayId}`, config);
    const res2 = await agent.get(`/essay/${essayId}/essay-submission`, config);
    dispatch({
      type: essayConstants.READ_ESSAY_SUCCESS,
      payload: { essay: res.data.data, submission: res2.data.data.data },
    });
  } catch (error) {
    dispatch({
      type: essayConstants.READ_ESSAY_FAIL,
      error,
    });
  }
};

const editEssay = (token, essayId, label, title, description) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    const body = {
      challenge_label: label,
      title,
      description,
    };
    dispatch({ type: essayConstants.EDIT_ESSAY_START });
    await agent.patch(`/essay/${essayId}`, body, config);
    dispatch({
      type: essayConstants.EDIT_ESSAY_SUCCESS,
      payload: { essayId, content: body },
    });
    dispatch(readEssay(token, essayId));
  } catch (error) {
    dispatch({
      type: essayConstants.EDIT_ESSAY_FAIL,
      error,
    });
  }
};

const deleteEssay = (token, essayId, onSuccess) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'auth-token': token,
      },
    };
    dispatch({ type: essayConstants.DELETE_ESSAY_START });
    await agent.delete(`/essay/${essayId}`, config);
    dispatch({
      type: essayConstants.DELETE_ESSAY_SUCCESS,
      payload: essayId,
    });
    onSuccess();
  } catch (error) {
    dispatch({
      type: essayConstants.DELETE_ESSAY_FAIL,
      error,
    });
  }
};

export { readEssay, editEssay, deleteEssay };
