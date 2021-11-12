import { submissionConstants } from '../../../actions/myClass/constant';

const initialState = {
  fetchJudgement: false,
};

export default function judgements(state = initialState, action) {
  switch (action.type) {
    case submissionConstants.FETCH_JUDGEMENT_START: {
      return {
        ...state,
        fetchJudgement: true,
      };
    }
    case submissionConstants.FETCH_JUDGEMENT_SUCCESS: {
      return {
        ...state,
        fetchJudgement: false,
      };
    }
    case submissionConstants.FETCH_JUDGEMENT_FAIL: {
      return {
        ...state,
        fetchJudgement: false,
      };
    }

    default:
      return state;
  }
}
