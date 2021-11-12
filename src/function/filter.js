export default function filterData(data, columnName, filter) {
  if (filter.includes('Select all')) {
    return data;
  }
  const newData = [];
  data.forEach((item) => {
    if (filter.includes(item[columnName])) {
      newData.push(item);
    }
  });
  return newData;
}
