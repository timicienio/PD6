import agent from '../agent';
import { judgementConstants } from './constant';

const verdictMapping = new Map([
  ['ACCEPTED', 'Accepted'],
  ['WRONG ANSWER', 'Wrong Answer'],
  ['MEMORY LIMIT EXCEED', 'Memory Limit Exceed'],
  ['TIME LIMIT EXCEED', 'Time Limit Exceed'],
  ['RUNTIME ERROR', 'Runtime Error'],
  ['COMPILE ERROR', 'Compile Error'],
  ['CONTACT MANAGER', 'Contact Manager'],
  ['FORBIDDEN ACTION', 'Forbidden Action'],
  ['SYSTEM ERROR', 'System Error'],
  [null, null],
]);

export const browseAllJudgementJudgeCase = (token, judgmentId) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  try {
    dispatch({ type: judgementConstants.BROWSE_ALL_JUDGEMENT_JUDGE_CASE_START });
    const res = await agent.get(`/judgment/${judgmentId}/judge-case`, config);
    const { data } = res.data;

    dispatch({
      type: judgementConstants.BROWSE_ALL_JUDGEMENT_JUDGE_CASE_SUCCESS,
      payload: {
        judgmentId,
        data: {
          judgement: {
            judge_case_ids: data.map(({ judgment_id, testcase_id }) => `${judgment_id}-${testcase_id}`),
          },
          judgeCases: data.map(({
            judgment_id, testcase_id, verdict, time_lapse, peak_memory, score,
          }) => ({
            id: `${judgment_id}-${testcase_id}`,
            testcase_id,
            judgment_id,
            verdict: verdictMapping.get(verdict),
            time_lapse,
            peak_memory,
            score,
          })),
        },
      },
    });
  } catch (error) {
    dispatch({
      type: judgementConstants.BROWSE_ALL_JUDGEMENT_JUDGE_CASE_FAIL,
      error,
    });
  }
};

export const browseAllSubmissionJudgement = () => {};
