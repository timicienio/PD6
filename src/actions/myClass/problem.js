import agent from '../agent';
import { problemConstants } from './constant';
import { autoTableConstants } from '../component/constant';
import browseParamsTransForm from '../../function/browseParamsTransform';
import getTextFromUrl from '../../function/getTextFromUrl';

const readProblemInfo = (token, problemId, onSuccess, onError) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };

  try {
    dispatch({ type: problemConstants.READ_PROBLEM_START });
    const res = await agent.get(`/problem/${problemId}`, config);
    dispatch({
      type: problemConstants.READ_PROBLEM_SUCCESS,
      payload: res.data.data,
    });
    if (typeof onSuccess === 'function') {
      onSuccess();
    }
  } catch (error) {
    dispatch({
      type: problemConstants.READ_PROBLEM_FAIL,
      error,
    });
    if (typeof onError === 'function') {
      onError();
    }
  }
};

const readProblemWithJudgeCode = (token, problemId, onSuccess, onError) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };

  try {
    dispatch({ type: problemConstants.READ_PROBLEM_START });
    const res = await agent.get(`/problem/${problemId}`, config);
    if (res.data.data.judge_source && res.data.data.judge_source.code_uuid) {
      const config2 = {
        headers: {
          'auth-token': token,
        },
        params: {
          filename: res.data.data.judge_source.filename,
          as_attachment: false,
        },
      };
      const res1 = await agent.get(`/s3-file/${res.data.data.judge_source.code_uuid}/url`, config2);
      const content = await getTextFromUrl(res1.data.data.url);
      dispatch({
        type: problemConstants.READ_PROBLEM_SUCCESS,
        payload: { ...res.data.data, judge_source: { ...res.data.data.judge_source, judge_code: content } },
      });
    } else {
      dispatch({
        type: problemConstants.READ_PROBLEM_SUCCESS,
        payload: res.data.data,
      });
    }
    if (typeof onSuccess === 'function') {
      onSuccess();
    }
  } catch (error) {
    dispatch({
      type: problemConstants.READ_PROBLEM_FAIL,
      error,
    });
    if (typeof onError === 'function') {
      onError();
    }
  }
};

// WITH BROWSE PARAM
const readSubmission = (token, accountId, problemId, browseParams, tableId = null) => async (dispatch) => {
  dispatch({ type: problemConstants.READ_SUBMISSION_START });
  const temp = {
    ...browseParams,
    filter: [['problem_id', '=', problemId]].concat(browseParams.filter),
    account_id: accountId,
  };
  const config = {
    headers: {
      'auth-token': token,
    },
    params: browseParamsTransForm(temp),
  };
  try {
    const res = await agent.get('/submission', config);
    const { data: submissions, total_count } = res.data.data;
    dispatch({
      type: problemConstants.READ_SUBMISSION_SUCCESS,
      payload: submissions,
    });
    dispatch({
      type: autoTableConstants.AUTO_TABLE_UPDATE,
      payload: {
        tableId,
        totalCount: total_count,
        dataIds: submissions.map((item) => item.id),
        offset: browseParams.offset,
      },
    });
  } catch (error) {
    dispatch({
      type: problemConstants.READ_SUBMISSION_FAIL,
      error,
    });
  }
};

// const browseJudgeCases = (token, judgmentId) => async (dispatch) => {
//   const config = {
//     headers: {
//       'auth-token': token,
//     },
//   };
//   try {
//     dispatch({ type: problemConstants.BROWSE_JUDGE_CASES_START });
//     const res = await agent.get(`/judgment/${judgmentId}/judge-case`, config);

//     dispatch({
//       type: problemConstants.BROWSE_JUDGE_CASES_SUCCESS,
//       payload: { judgmentId, data: res.data.data },
//     });
//   } catch (error) {
//     dispatch({
//       type: problemConstants.BROWSE_JUDGE_CASES_FAIL,
//       error,
//     });
//   }
// };

const browseTestcase = (token, problemId) => async (dispatch) => {
  dispatch({ type: problemConstants.FETCH_TESTCASE_UNDER_PROBLEM_START });
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  try {
    const testcases = await agent.get(`/problem/${problemId}/testcase`, config);

    const { data } = testcases.data;
    const newTestcases = await Promise.all(
      data.map(async (testcase) => {
        if (testcase.is_sample === true) {
          if (testcase.input_file_uuid !== null && testcase.output_file_uuid !== null) {
            const config1 = {
              headers: {
                'auth-token': token,
              },
              params: {
                filename: testcase.input_filename,
                as_attachment: false,
              },
            };
            const config2 = {
              headers: {
                'auth-token': token,
              },
              params: {
                filename: testcase.output_filename,
                as_attachment: false,
              },
            };
            const res1 = await agent.get(`/s3-file/${testcase.input_file_uuid}/url`, config1);
            const res2 = await agent.get(`/s3-file/${testcase.output_file_uuid}/url`, config2);
            if (res1.data.success && res2.data.success) {
              const input = await getTextFromUrl(res1.data.data.url);
              const output = await getTextFromUrl(res2.data.data.url);
              return {
                ...testcase,
                input,
                output,
              };
            }
            return {
              ...testcase,
              input: '',
              output: '',
            };
          }
          if (testcase.input_file_uuid !== null) {
            const config1 = {
              headers: {
                'auth-token': token,
              },
              params: {
                filename: testcase.input_filename,
                as_attachment: false,
              },
            };
            const res1 = await agent.get(`/s3-file/${testcase.input_file_uuid}/url`, config1);
            if (res1.data.success) {
              const input = await getTextFromUrl(res1.data.data.url);
              return {
                ...testcase,
                input,
                output: '',
              };
            }
            return {
              ...testcase,
              input: '',
              output: '',
            };
          }
          if (testcase.output_file_uuid !== null) {
            const config2 = {
              headers: {
                'auth-token': token,
              },
              params: {
                filename: testcase.output_filename,
                as_attachment: false,
              },
            };
            const res2 = await agent.get(`/s3-file/${testcase.output_file_uuid}/url`, config2);
            if (res2.data.success) {
              const output = await getTextFromUrl(res2.data.data.url);
              return {
                ...testcase,
                input: '',
                output,
              };
            }
            return {
              ...testcase,
              input: '',
              output: '',
            };
          }
          return {
            ...testcase,
            input: '',
            output: '',
          };
        }
        return testcase;
      }),
    );
    dispatch({
      type: problemConstants.FETCH_TESTCASE_UNDER_PROBLEM_SUCCESS,
      payload: { problemId, testcases: newTestcases },
    });
  } catch (error) {
    dispatch({
      type: problemConstants.FETCH_TESTCASE_UNDER_PROBLEM_FAIL,
      error,
    });
  }
};

const browseAssistingData = (token, problemId) => async (dispatch) => {
  dispatch({ type: problemConstants.BROWSE_ASSISTING_DATA_START });
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  try {
    const res = await agent.get(`/problem/${problemId}/assisting-data`, config);
    dispatch({
      type: problemConstants.BROWSE_ASSISTING_DATA_SUCCESS,
      payload: { problemId, assistingData: res.data.data },
    });
  } catch (error) {
    dispatch({
      type: problemConstants.BROWSE_ASSISTING_DATA_FAIL,
      error,
    });
  }
};

const editProblemInfo = (
  token,
  problemId,
  label,
  title,
  judgeType,
  score,
  testcaseDisabled,
  description,
  ioDescription,
  source,
  hint,
  judgeLanguage,
  judgeCode,
  onSuccess,
) => async (dispatch) => {
  dispatch({ type: problemConstants.EDIT_PROBLEM_START });
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  try {
    if (judgeType === 'NORMAL') {
      const body = {
        challenge_label: label,
        title,
        judge_type: judgeType,
        full_score: score,
        testcase_disabled: testcaseDisabled,
        description,
        io_description: ioDescription,
        source,
        hint,
      };
      await agent.patch(`/problem/${problemId}`, body, config);
      dispatch({
        type: problemConstants.EDIT_PROBLEM_SUCCESS,
        payload: { problemId, content: body },
      });
    } else {
      const body = {
        challenge_label: label,
        title,
        judge_type: judgeType,
        full_score: score,
        testcase_disabled: testcaseDisabled,
        description,
        io_description: ioDescription,
        source,
        hint,
        judge_source: {
          judge_language: judgeLanguage,
          judge_code: judgeCode,
        },
      };
      await agent.patch(`/problem/${problemId}`, body, config);
      dispatch({
        type: problemConstants.EDIT_PROBLEM_SUCCESS,
        payload: { problemId, content: body },
      });
    }
    // console.log(judgeType, judgeLanguage, judgeCode);
  } catch (error) {
    dispatch({
      type: problemConstants.EDIT_PROBLEM_FAIL,
      error,
    });
  }
  onSuccess();
};

const deleteProblem = (token, problemId) => async (dispatch) => {
  dispatch({ type: problemConstants.DELETE_PROBLEM_START });
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  try {
    await agent.delete(`/problem/${problemId}`, config);

    dispatch({
      type: problemConstants.DELETE_PROBLEM_SUCCESS,
      payload: problemId,
    });
  } catch (error) {
    dispatch({
      type: problemConstants.DELETE_PROBLEM_FAIL,
      error,
    });
  }
};

const submitCode = (token, problemId, languageId, content, onSuccess, onError) => async (dispatch) => {
  dispatch({ type: problemConstants.SUBMIT_PROBLEM_START });
  const config = {
    headers: {
      'auth-token': token,
      'Content-Type': 'multipart/form-data',
    },
    params: {
      language_id: languageId,
    },
  };
  const blob = new Blob([content], { type: 'text/plain' });
  const file = new File([blob], 'foo.txt', { type: 'text/plain' });
  const formData = new FormData();
  formData.append('content_file', file);

  try {
    await agent.post(`/problem/${problemId}/submission`, formData, config);
    dispatch({
      type: problemConstants.SUBMIT_PROBLEM_SUCCESS,
    });
    onSuccess();
  } catch (error) {
    dispatch({
      type: problemConstants.SUBMIT_PROBLEM_FAIL,
      error,
    });
    onError();
  }
};

const editTestcase = (token, testcaseId, isSample, score, timeLimit, memoryLimit, note, isDisabled) => async (dispatch) => {
  // just edit basic info
  dispatch({ type: problemConstants.EDIT_TESTCASE_START });
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  const body = {
    is_sample: isSample,
    score,
    time_limit: timeLimit,
    memory_limit: memoryLimit,
    note,
    is_disabled: isDisabled,
  };
  try {
    await agent.patch(`/testcase/${testcaseId}`, body, config);

    dispatch({
      type: problemConstants.EDIT_TESTCASE_SUCCESS,
      payload: testcaseId,
    });
  } catch (error) {
    dispatch({
      type: problemConstants.EDIT_TESTCASE_FAIL,
      error,
    });
  }
};

const browseTestcases = (token, problemId) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  try {
    dispatch({ type: problemConstants.BROWSE_TESTCASES_START });
    const res = await agent.get(`/problem/${problemId}/testcase`, config);
    dispatch({
      type: problemConstants.BROWSE_TESTCASES_SUCCESS,
      payload: { problemId, testcases: res.data.data },
    });
  } catch (error) {
    dispatch({
      type: problemConstants.BROWSE_TESTCASES_FAIL,
      error,
    });
  }
};

const readProblemScore = (token, problemId) => async (dispatch) => {
  dispatch({ type: problemConstants.READ_PROBLEM_SCORE_START });
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  try {
    const res = await agent.get(`/problem/${problemId}/score`, config);

    dispatch({
      type: problemConstants.READ_PROBLEM_SCORE_SUCCESS,
      payload: { data: res.data.data, problemId },
    });
  } catch (error) {
    dispatch({
      type: problemConstants.READ_PROBLEM_SCORE_FAIL,
      error,
    });
  }
};

const readProblemBestScore = (token, problemId) => async (dispatch) => {
  dispatch({ type: problemConstants.READ_PROBLEM_BEST_SCORE_START });
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  try {
    const res = await agent.get(`/problem/${problemId}/best-score`, config);

    dispatch({
      type: problemConstants.READ_PROBLEM_BEST_SCORE_SUCCESS,
      payload: { data: res.data.data, problemId },
    });
  } catch (error) {
    dispatch({
      type: problemConstants.READ_PROBLEM_BEST_SCORE_FAIL,
      error,
    });
  }
};

const downloadAllSamples = (token, problemId, as_attachment) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
    params: {
      as_attachment,
    },
  };
  dispatch({ type: problemConstants.DOWNLOAD_ALL_SAMPLE_TESTCASE_START });
  try {
    await agent.post(`/problem/${problemId}/all-sample-testcase`, {}, config);
    dispatch({ type: problemConstants.DOWNLOAD_ALL_SAMPLE_TESTCASE_SUCCESS });
  } catch (error) {
    dispatch({
      type: problemConstants.DOWNLOAD_ALL_SAMPLE_TESTCASE_FAIL,
      error,
    });
  }
};

const downloadAllTestcases = (token, problemId, as_attachment) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
    params: {
      as_attachment,
    },
  };
  dispatch({ type: problemConstants.DOWNLOAD_ALL_NON_SAMPLE_TESTCASE_START });
  try {
    await agent.post(`/problem/${problemId}/all-non-sample-testcase`, {}, config);

    dispatch({ type: problemConstants.DOWNLOAD_ALL_NON_SAMPLE_TESTCASE_SUCCESS });
  } catch (error) {
    dispatch({
      type: problemConstants.DOWNLOAD_ALL_NON_SAMPLE_TESTCASE_FAIL,
      error,
    });
  }
};

const saveSamples = (token, problemId, testcases, sampleDataIds, sampleTableData, onSuccess, onError) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  const fileConfig = {
    headers: {
      'auth-token': token,
      'Content-Type': 'multipart/form-data',
    },
  };
  await Promise.all(
    sampleDataIds.map(async (id) => {
      if (sampleTableData[id] === undefined) {
        // delete data
        try {
          dispatch({ type: problemConstants.DELETE_TESTCASE_START });
          await agent.delete(`/testcase/${id}`, config);
          dispatch({
            type: problemConstants.DELETE_TESTCASE_SUCCESS,
          });
        } catch (error) {
          dispatch({
            type: problemConstants.DELETE_TESTCASE_FAIL,
            error,
          });
        }
      }
      return id;
    }),
  );

  await Promise.all(
    Object.keys(sampleTableData).map(async (id) => {
      if (sampleTableData[id].new) {
        // add testcase with file
        dispatch({ type: problemConstants.ADD_TESTCASE_START });
        const body = {
          is_sample: true,
          score: 0,
          time_limit: sampleTableData[id].time_limit,
          memory_limit: sampleTableData[id].memory_limit,
          is_disabled: false,
          note: sampleTableData[id].note,
          label: sampleTableData[id].label,
        };
        try {
          const res = await agent.post(`/problem/${problemId}/testcase`, body, config);
          const testcaseId = res.data.data.id;
          if (sampleTableData[id].in_file != null) {
            const formData = new FormData();
            formData.append('input_file', sampleTableData[id].in_file);
            await agent.put(`/testcase/${testcaseId}/input-data`, formData, fileConfig);
          }
          if (sampleTableData[id].out_file != null) {
            const formData = new FormData();
            formData.append('output_file', sampleTableData[id].out_file);
            await agent.put(`/testcase/${testcaseId}/output-data`, formData, fileConfig);
          }
          dispatch({ type: problemConstants.ADD_TESTCASE_SUCCESS });
        } catch (error) {
          dispatch({
            type: problemConstants.ADD_TESTCASE_FAIL,
            error,
          });
          if (sampleTableData[id].in_file != null) {
            onError(sampleTableData[id].in_file.name);
          }
          if (sampleTableData[id].out_file != null) {
            onError(sampleTableData[id].out_file.name);
          }
        }
      } else {
        // check basic info
        if (
          testcases[id].time_limit !== sampleTableData[id].time_limit
            || testcases[id].memory_limit !== sampleTableData[id].memory_limit
            || testcases[id].is_disabled !== false
            || testcases[id].note !== sampleTableData[id].note
        ) {
          // console.log('editTestcase', sampleTableData[id]);
          await dispatch(
            editTestcase(token, id, true, 0, sampleTableData[id].time_limit, sampleTableData[id].memory_limit, sampleTableData[id].note, false),
          );
        }
        // upload file
        if (sampleTableData[id].in_file !== null) {
          try {
            dispatch({ type: problemConstants.UPLOAD_TESTCASE_INPUT_START });
            const formData = new FormData();
            formData.append('input_file', sampleTableData[id].in_file);
            await agent.put(`/testcase/${id}/input-data`, formData, fileConfig);
            dispatch({ type: problemConstants.UPLOAD_TESTCASE_INPUT_SUCCESS });
          } catch (error) {
            dispatch({
              type: problemConstants.UPLOAD_TESTCASE_INPUT_FAIL,
              error,
            });
            onError(sampleTableData[id].in_file.name);
          }
        }
        if (sampleTableData[id].out_file !== null) {
          try {
            dispatch({ type: problemConstants.UPLOAD_TESTCASE_OUTPUT_START });
            const formData = new FormData();
            formData.append('output_file', sampleTableData[id].out_file);
            await agent.put(`/testcase/${id}/output-data`, formData, fileConfig);
            dispatch({ type: problemConstants.UPLOAD_TESTCASE_OUTPUT_SUCCESS });
          } catch (error) {
            dispatch({
              type: problemConstants.UPLOAD_TESTCASE_OUTPUT_FAIL,
              error,
            });
            onError(sampleTableData[id].out_file.name);
          }
        }
      }
      return id;
    }),
  );

  onSuccess();
};

const saveTestcases = (token, problemId, testcases, testcaseDataIds, testcaseTableData, status, onSuccess, onError) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  const fileConfig = {
    headers: {
      'auth-token': token,
      'Content-Type': 'multipart/form-data',
    },
  };
  await Promise.all(
    testcaseDataIds.map(async (id) => {
      if (testcaseTableData[id] === undefined) {
        // delete data
        try {
          dispatch({ type: problemConstants.DELETE_TESTCASE_START });
          await agent.delete(`/testcase/${id}`, config);
          dispatch({
            type: problemConstants.DELETE_TESTCASE_SUCCESS,
          });
        } catch (error) {
          dispatch({
            type: problemConstants.DELETE_TESTCASE_FAIL,
            error,
          });
        }
      }
      return id;
    }),
  );

  await Promise.all(
    Object.keys(testcaseTableData).map(async (id) => {
      if (testcaseTableData[id].new) {
        // add testcase with file
        dispatch({ type: problemConstants.ADD_TESTCASE_START });
        const body = {
          is_sample: false,
          score: testcaseTableData[id].score,
          time_limit: testcaseTableData[id].time_limit,
          memory_limit: testcaseTableData[id].memory_limit,
          note: testcaseTableData[id].note,
          is_disabled: !status,
          label: testcaseTableData[id].label,
        };
        try {
          const res = await agent.post(`/problem/${problemId}/testcase`, body, config);
          const testcaseId = res.data.data.id;
          if (testcaseTableData[id].in_file != null) {
            const formData = new FormData();
            formData.append('input_file', testcaseTableData[id].in_file);
            await agent.put(`/testcase/${testcaseId}/input-data`, formData, fileConfig);
          }
          if (testcaseTableData[id].out_file != null) {
            const formData = new FormData();
            formData.append('output_file', testcaseTableData[id].out_file);
            await agent.put(`/testcase/${testcaseId}/output-data`, formData, fileConfig);
          }
          dispatch({ type: problemConstants.ADD_TESTCASE_SUCCESS });
        } catch (error) {
          dispatch({
            type: problemConstants.ADD_TESTCASE_FAIL,
            error,
          });
          if (testcaseTableData[id].in_file != null) {
            onError(testcaseTableData[id].in_file.name);
          }
          if (testcaseTableData[id].out_file != null) {
            onError(testcaseTableData[id].out_file.name);
          }
        }
      } else {
        // check basic info
        if (
          testcases[id].time_limit !== testcaseTableData[id].time_limit
            || testcases[id].memory_limit !== testcaseTableData[id].memory_limit
            || testcases[id].score !== testcaseTableData[id].score
            || testcases[id].is_disabled !== !status
            || testcases[id].note !== testcaseTableData[id].note
        ) {
          await dispatch(
            editTestcase(
              token,
              id,
              false,
              testcaseTableData[id].score,
              testcaseTableData[id].time_limit,
              testcaseTableData[id].memory_limit,
              testcaseTableData[id].note,
              !status,
            ),
          );
        }
        // upload file
        if (testcaseTableData[id].in_file !== null) {
          try {
            dispatch({ type: problemConstants.UPLOAD_TESTCASE_INPUT_START });
            const formData = new FormData();
            formData.append('input_file', testcaseTableData[id].in_file);
            await agent.put(`/testcase/${id}/input-data`, formData, fileConfig);
            dispatch({ type: problemConstants.UPLOAD_TESTCASE_INPUT_SUCCESS });
          } catch (error) {
            dispatch({
              type: problemConstants.UPLOAD_TESTCASE_INPUT_FAIL,
              error,
            });
            onError(testcaseTableData[id].in_file.name);
          }
        }
        if (testcaseTableData[id].out_file !== null) {
          try {
            dispatch({ type: problemConstants.UPLOAD_TESTCASE_OUTPUT_START });
            const formData = new FormData();
            formData.append('output_file', testcaseTableData[id].out_file);
            await agent.put(`/testcase/${id}/output-data`, formData, fileConfig);
            dispatch({ type: problemConstants.UPLOAD_TESTCASE_OUTPUT_SUCCESS });
          } catch (error) {
            dispatch({
              type: problemConstants.UPLOAD_TESTCASE_OUTPUT_FAIL,
              error,
            });
            onError(testcaseTableData[id].out_file.name);
          }
        }
      }
      return id;
    }),
  );
  onSuccess();
};

const saveAssistingData = (token, problemId, assistingData, assistingDataIds, assistTableData, onSuccess, onError) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  const config2 = {
    headers: {
      'auth-token': token,
    },
    'Content-Type': 'multipart/form-data',
  };
  await Promise.all(
    assistingDataIds.map(async (id) => {
      if (assistTableData.filter((item) => item.filename === assistingData[id].filename).length === 0) {
        // delete assisting data
        try {
          dispatch({ type: problemConstants.DELETE_ASSISTING_DATA_START });
          await agent.delete(`/assisting-data/${id}`, config);
          dispatch({ type: problemConstants.DELETE_ASSISTING_DATA_SUCCESS });
        } catch (error) {
          dispatch({ type: problemConstants.DELETE_ASSISTING_DATA_FAIL, error });
        }
      }
      return id;
    }),
  );

  await Promise.all(
    assistTableData.map(async (item) => {
      if (assistingDataIds.filter((id) => assistingData[id].filename === item.filename).length === 0) {
        // add assisting data
        const formData = new FormData();
        formData.append('assisting_data', item.file);

        try {
          dispatch({ type: problemConstants.ADD_ASSISTING_DATA_START });
          await agent.post(`/problem/${problemId}/assisting-data`, formData, config2);
          dispatch({ type: problemConstants.ADD_ASSISTING_DATA_SUCCESS });
        } catch (error) {
          onError(item.filename);
          dispatch({ type: problemConstants.ADD_ASSISTING_DATA_FAIL, error });
        }
      } else if (item.file !== null) {
        // edit assisting data
        const formData = new FormData();
        formData.append('assisting_data_file', item.file);
        try {
          dispatch({ type: problemConstants.EDIT_ASSISTING_DATA_START });
          await agent.put(`/assisting-data/${item.id}`, formData, config2);
          dispatch({ type: problemConstants.EDIT_ASSISTING_DATA_SUCCESS });
        } catch (error) {
          onError(item.filename);
          dispatch({ type: problemConstants.ADD_ASSISTING_DATA_FAIL, error });
        }
      }
      return item;
    }),
  );

  onSuccess();
};

const rejudgeSubmission = (token, submissionId) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: problemConstants.REJUDGE_SUBMISSION_START });
  try {
    await agent.post(`/submission/${submissionId}/rejudge`, {}, config);

    dispatch({ type: problemConstants.REJUDGE_SUBMISSION_SUCCESS });
  } catch (error) {
    dispatch({
      type: problemConstants.REJUDGE_SUBMISSION_FAIL,
      error,
    });
  }
};

const rejudgeProblem = (token, problemId) => async (dispatch) => {
  const config = {
    headers: {
      'auth-token': token,
    },
  };
  dispatch({ type: problemConstants.REJUDGE_PROBLEM_START });
  try {
    await agent.post(`/problem/${problemId}/rejudge`, {}, config);

    dispatch({ type: problemConstants.REJUDGE_PROBLEM_SUCCESS });
  } catch (error) {
    dispatch({
      type: problemConstants.REJUDGE_PROBLEM_FAIL,
      error,
    });
  }
};

// WITH BROWSE PARAM
const viewMySubmissionUnderProblem = (token, accountId, problemId, browseParams, tableId = null) => async (dispatch) => {
  dispatch({ type: problemConstants.VIEW_MY_SUBMISSION_UNDER_PROBLEM_START });
  const temp = {
    ...browseParams,
    filter: [['problem_id', '=', problemId]].concat(browseParams.filter),
    account_id: accountId,
  };
  const config = {
    headers: {
      'auth-token': token,
    },
    params: browseParamsTransForm(temp),
  };
  try {
    const res = await agent.get('/view/my-submission', config);
    const { data, total_count } = res.data.data;
    const config2 = {
      headers: { 'auth-token': token },
      params: { submission_ids: JSON.stringify(data.map((item) => item.submission_id)) },
    };
    const res2 = await agent.get('/submission/judgment/batch', config2);
    const judgments = res2.data.data;
    const submissions = data.map((item) => {
      const latestJudgment = judgments.filter((judgment) => judgment.submission_id === item.submission_id);
      return {
        id: item.submission_id,
        verdict: item.verdict,
        submit_time: item.submit_time,
        latestJudgmentId: latestJudgment.length === 0 ? null : latestJudgment[0].id,
      };
    });

    dispatch({
      type: problemConstants.VIEW_MY_SUBMISSION_UNDER_PROBLEM_SUCCESS,
      payload: { problemId, submissions, judgments },
    });
    dispatch({
      type: autoTableConstants.AUTO_TABLE_UPDATE,
      payload: {
        tableId,
        totalCount: total_count,
        dataIds: submissions.map((item) => item.id),
        offset: browseParams.offset,
      },
    });
  } catch (error) {
    dispatch({
      type: problemConstants.VIEW_MY_SUBMISSION_UNDER_PROBLEM_FAIL,
      error,
    });
  }
};

export {
  readProblemInfo,
  readProblemWithJudgeCode,
  editProblemInfo,
  deleteProblem,
  readSubmission,
  browseTestcase,
  browseAssistingData,
  submitCode,
  editTestcase,
  // browseJudgeCases,
  browseTestcases,
  readProblemScore,
  readProblemBestScore,
  downloadAllSamples,
  downloadAllTestcases,
  rejudgeSubmission,
  rejudgeProblem,
  saveSamples,
  saveTestcases,
  saveAssistingData,
  viewMySubmissionUnderProblem,
};
