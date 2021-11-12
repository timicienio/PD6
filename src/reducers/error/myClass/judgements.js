import { submissionConstants } from '../../../actions/myClass/constant';

const initialState = {
  fetchJudgement: null,
};

export default function judgements(state = initialState, action) {
  switch (action.type) {
    case submissionConstants.FETCH_JUDGEMENT_START: {
      return {
        ...state,
        fetchJudgement: null,
      };
    }
    case submissionConstants.FETCH_JUDGEMENT_SUCCESS: {
      return {
        ...state,
        fetchJudgement: null,
      };
    }
    case submissionConstants.FETCH_JUDGEMENT_FAIL: {
      return {
        ...state,
        fetchJudgement: action.error,
      };
    }

    default:
      return state;
  }
}
