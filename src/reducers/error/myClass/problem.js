import { problemConstants } from '../../../actions/myClass/constant';

const initialState = {
  readProblem: null,
  readSubmission: null,
  browseTestcase: null,
  browseAssistingData: null,
  editProblem: null,
  deleteProblem: null,
  deleteTestcase: null,
  deleteAssistingData: null,
  editAssistingData: null,
  addAssistingData: null,
  submitCode: null,
  editTestcase: null,
  uploadTestcaseInput: null,
  uploadTestcaseOutput: null,
  addTestcase: null,
  browseJudgeCases: null,
  readProblemScore: null,
  readProblemBestScore: null,
  downloadSamples: null,
  downloadTestcases: null,
  rejudgeSubmission: null,
  browseTestcases: null,
  rejudgeProblem: null,
  viewMySubmissionUnderProblem: null,
};

export default function problem(state = initialState, action) {
  switch (action.type) {
    case problemConstants.VIEW_MY_SUBMISSION_UNDER_PROBLEM_START:
      return {
        ...state,
        viewMySubmissionUnderProblem: null,
      };
    case problemConstants.VIEW_MY_SUBMISSION_UNDER_PROBLEM_SUCCESS:
      return {
        ...state,
        viewMySubmissionUnderProblem: null,
      };
    case problemConstants.VIEW_MY_SUBMISSION_UNDER_PROBLEM_FAIL:
      return {
        ...state,
        viewMySubmissionUnderProblem: action.error,
      };

    case problemConstants.READ_PROBLEM_FAIL:
      return {
        ...state,
        readProblem: action.error,
      };
    case problemConstants.READ_SUBMISSION_FAIL:
      return {
        ...state,
        readSubmission: action.error,
      };

    case problemConstants.BROWSE_JUDGE_CASES_FAIL:
      return {
        ...state,
        browseJudgeCases: action.error,
      };
    case problemConstants.FETCH_TESTCASE_UNDER_PROBLEM_FAIL:
      return {
        ...state,
        browseTestcase: action.error,
      };
    case problemConstants.BROWSE_ASSISTING_DATA_FAIL:
      return {
        ...state,
        browseAssistingData: action.error,
      };
    case problemConstants.EDIT_PROBLEM_FAIL:
      return {
        ...state,
        editProblem: action.error,
      };
    case problemConstants.DELETE_PROBLEM_FAIL:
      return {
        ...state,
        deleteProblem: action.error,
      };
    case problemConstants.DELETE_TESTCASE_FAIL:
      return {
        ...state,
        deleteTestcase: action.error,
      };
    case problemConstants.DELETE_ASSISTING_DATA_FAIL:
      return {
        ...state,
        deleteAssistingData: action.error,
      };
    case problemConstants.EDIT_ASSISTING_DATA_FAIL:
      return {
        ...state,
        editAssistingData: action.error,
      };
    case problemConstants.ADD_ASSISTING_DATA_FAIL:
      return {
        ...state,
        addAssistingData: action.error,
      };
    case problemConstants.SUBMIT_PROBLEM_START:
      return {
        ...state,
        submitCode: null,
      };
    case problemConstants.SUBMIT_PROBLEM_FAIL:
      return {
        ...state,
        submitCode: action.error,
      };
    case problemConstants.EDIT_TESTCASE_FAIL:
      return {
        ...state,
        editTestcase: action.error,
      };
    case problemConstants.UPLOAD_TESTCASE_INPUT_FAIL:
      return {
        ...state,
        uploadTestcaseInput: action.error,
      };
    case problemConstants.UPLOAD_TESTCASE_OUTPUT_FAIL:
      return {
        ...state,
        uploadTestcaseOutput: action.error,
      };
    case problemConstants.ADD_TESTCASE_FAIL:
      return {
        ...state,
        addTestcase: action.error,
      };
    case problemConstants.READ_PROBLEM_SCORE_FAIL:
      return {
        ...state,
        readProblemScore: action.error,
      };

    case problemConstants.READ_PROBLEM_BEST_SCORE_SUCCESS:
      return {
        ...state,
        readProblemBestScore: null,
      };
    case problemConstants.READ_PROBLEM_BEST_SCORE_FAIL:
      return {
        ...state,
        readProblemBestScore: action.error,
      };

    case problemConstants.DOWNLOAD_ALL_SAMPLE_TESTCASE_SUCCESS:
      return {
        ...state,
        downloadSamples: null,
      };
    case problemConstants.DOWNLOAD_ALL_SAMPLE_TESTCASE_FAIL:
      return {
        ...state,
        downloadSamples: action.error,
      };

    case problemConstants.DOWNLOAD_ALL_NON_SAMPLE_TESTCASE_SUCCESS:
      return {
        ...state,
        downloadTestcases: null,
      };
    case problemConstants.DOWNLOAD_ALL_NON_SAMPLE_TESTCASE_FAIL:
      return {
        ...state,
        downloadTestcases: action.error,
      };

    case problemConstants.REJUDGE_SUBMISSION_SUCCESS:
      return {
        ...state,
        rejudgeSubmission: null,
      };
    case problemConstants.REJUDGE_SUBMISSION_FAIL:
      return {
        ...state,
        rejudgeSubmission: action.error,
      };

    case problemConstants.BROWSE_TESTCASES_SUCCESS:
      return {
        ...state,
        browseTestcases: null,
      };
    case problemConstants.BROWSE_TESTCASES_FAIL:
      return {
        ...state,
        browseTestcases: action.error,
      };

    case problemConstants.REJUDGE_PROBLEM_SUCCESS:
      return {
        ...state,
        rejudgeProblem: null,
      };
    case problemConstants.REJUDGE_PROBLEM_FAIL:
      return {
        ...state,
        rejudgeProblem: action.error,
      };
    default: {
      return state;
    }
  }
}
