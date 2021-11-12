export default function sortData(data, columnName, sortMode) {
  switch (sortMode) {
    case '(None)':
      return data;
    case 'A to Z': {
      const tempData = [...data];
      tempData.sort((a, b) => {
        const statusA = a[columnName];
        const statusB = b[columnName];
        if (statusA > statusB) {
          return -1;
        }
        if (statusA < statusB) {
          return 1;
        }
        return 0;
      });
      return tempData;
    }
    case 'Z to A': {
      const tempData = [...data];
      tempData.sort((a, b) => {
        const statusA = a[columnName];
        const statusB = b[columnName];
        if (statusA < statusB) {
          return -1;
        }
        if (statusA > statusB) {
          return 1;
        }
        return 0;
      });
      return tempData;
    }
    default:
      return data;
  }
}
