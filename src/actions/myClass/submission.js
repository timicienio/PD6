import agent from '../agent';
import { submissionConstants } from './constant';
import getTextFromUrl from '../../function/getTextFromUrl';

const fetchSubmission = (token, submissionId) => (dispatch) => {
  const config1 = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: submissionConstants.FETCH_SUBMISSION_START });

  agent
    .get(`/submission/${submissionId}`, config1)
    .then((res) => {
      if (res.data.data.content_file_uuid !== null && res.data.data.filename !== null) {
        const config2 = {
          headers: {
            'auth-token': token,
          },
          params: {
            filename: res.data.data.filename,
            as_attachment: false,
          },
        };
        agent.get(`/s3-file/${res.data.data.content_file_uuid}/url`, config2).then(async (res2) => {
          const code = await getTextFromUrl(res2.data.data.url);

          dispatch({
            type: submissionConstants.FETCH_SUBMISSION_SUCCESS,
            payload: { submissionId, data: { ...res.data.data, content: code } },
          });
        });
      } else {
        dispatch({
          type: submissionConstants.FETCH_SUBMISSION_SUCCESS,
          payload: { submissionId, data: res.data.data },
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: submissionConstants.FETCH_SUBMISSION_FAIL,
        error,
      });
    });
};

// fetch latest judgement
const readSubmissionDetail = (token, submissionId) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };

  try {
    dispatch({ type: submissionConstants.READ_SUBMISSION_JUDGE_START });
    const res = await agent.get(`/submission/${submissionId}/latest-judgment`, config);

    dispatch({
      type: submissionConstants.READ_SUBMISSION_JUDGE_SUCCESS,
      payload: { submissionId, judgment: res.data.data },
    });
  } catch (error) {
    dispatch({
      type: submissionConstants.READ_SUBMISSION_JUDGE_FAIL,
      error,
    });
  }
};

// browse judge cases under judgement
// const browseJudgeCases = (token, judgmentId) => async (dispatch) => {
//   const config = {
//     headers: {
//       'auth-token': token,
//     },
//   };
//   try {
//     dispatch({ type: submissionConstants.BROWSE_JUDGE_CASES_START });
//     const res = await agent.get(`/judgment/${judgmentId}/judge-case`, config);
//     dispatch({
//       type: submissionConstants.BROWSE_JUDGE_CASES_SUCCESS,
//       payload: { judgmentId, data: res.data.data },
//     });
//   } catch (error) {
//     dispatch({
//       type: submissionConstants.BROWSE_JUDGE_CASES_FAIL,
//       error,
//     });
//   }
// };

const browseTestcases = (token, problemId) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  try {
    dispatch({ type: submissionConstants.BROWSE_TESTCASES_START });
    const res = await agent.get(`/problem/${problemId}/testcase`, config);
    dispatch({
      type: submissionConstants.BROWSE_TESTCASES_SUCCESS,
      payload: { problemId, testcases: res.data.data },
    });
  } catch (error) {
    dispatch({
      type: submissionConstants.BROWSE_TESTCASES_FAIL,
      error,
    });
  }
};

const rejudgeSubmission = (token, submissionId) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: submissionConstants.REJUDGE_SUBMISSION_START });
  try {
    await agent.post(`/submission/${submissionId}/rejudge`, {}, config);

    dispatch({ type: submissionConstants.REJUDGE_SUBMISSION_SUCCESS });
  } catch (error) {
    dispatch({
      type: submissionConstants.REJUDGE_SUBMISSION_FAIL,
      error,
    });
  }
};

export {
  // fetchClassSubmissions,
  fetchSubmission,
  // fetchJudgement,
  readSubmissionDetail,
  // browseJudgeCases,
  browseTestcases,
  rejudgeSubmission,
};
