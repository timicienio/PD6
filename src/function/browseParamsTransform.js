const browseParamsTransForm = (params) => ({
  ...params,
  filter: JSON.stringify(params.filter),
  sort: JSON.stringify(params.sort),
});

export default browseParamsTransForm;
