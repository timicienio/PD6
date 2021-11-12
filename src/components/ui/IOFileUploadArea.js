/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  makeStyles,
  Typography,
  Button,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Snackbar,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import Icon from './icon/index';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    // verticalAlign: 'center',
  },
  alignedTextWrapper: {
    boxSizing: 'content-box',
  },
  alignedTextWrapperMd: {
    width: '190px',
  },
  alignedText: {
    marginTop: '23px',
    marginBottom: '16px',
  },
  textAlignedText: {
    marginTop: '0px',
    marginBottom: '16px',
  },
  browseButton: {
    marginRight: '10px',
  },
  fieldAlignedText: {
    marginTop: '18px',
  },
  input: {
    width: '30px',
    height: '40px',
    display: 'none',
    marginTop: '10px',
  },
  root: {
    width: '100%',
    overflowX: 'hide',
  },
  container: {
    maxHeight: 800,
  },
  tableHead: {
    height: '45px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: theme.palette.grey.A400,
  },
  column: {
    display: 'flex',
    justifyContent: 'center',
  },
  fileNameCell: {
    height: '40px',
    padding: 'unset',
    paddingLeft: '50px',
    borderBottomColor: theme.palette.grey.A700,
  },
  deleteCell: {
    height: '40px',
    padding: '8px 30px 4px 0',
    borderBottomColor: theme.palette.grey.A700,
  },
  deleteIcon: {
    height: '20px',
    width: '20px',
    cursor: 'pointer',
  },
  row: {
    height: '40px',
    '&:first-child': {
      borderTopColor: theme.palette.grey.A400,
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
    },
  },
}));

export default function IOFileUploadArea({
  text, uploadCase, selectedFile, setSelectedFile,
}) {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);
  const [fileNum, setFileNum] = useState(0);
  const [errorPopup, setErrorPopup] = useState(false);

  const parseIndexAndType = (fileName) => {
    switch (uploadCase) {
      case 'sample':
        return [Number(fileName.slice(6, fileName.indexOf('.'))), fileName.slice(fileName.indexOf('.') + 1)];
      case 'testcase':
        return [Number(fileName.slice(0, fileName.indexOf('.'))), fileName.slice(fileName.indexOf('.') + 1)];
      default: {
        setErrorPopup(true);
        return [null, null];
      }
    }
  };

  const handleUploadFile = (e) => {
    const newFiles = [...e.target.files];
    const newSelectedFiles = newFiles.reduce((acc, file) => {
      const [index, type] = parseIndexAndType(file.name);
      if (!Number.isInteger(index) || index === 0) {
        setErrorPopup(true);
        return { ...acc };
      }
      if (type === 'in') {
        if (acc[index] === undefined) {
          // no corresponding .out file
          return {
            ...acc,
            [index]: {
              id: index,
              in: file,
              out: null,
            },
          };
        }
        return {
          ...acc,
          [index]: {
            ...acc[index],
            in: file,
          },
        };
      }
      if (type === 'out') {
        if (acc[index] === undefined) {
          // no corresponding .in file
          return {
            ...acc,
            [index]: {
              id: index,
              in: null,
              out: file,
            },
          };
        }
        return {
          ...acc,
          [index]: {
            ...acc[index],
            out: file,
          },
        };
      }
      // error
      setErrorPopup(true);
      return acc;
    }, selectedFile);

    // object to array
    setSelectedFile(newSelectedFiles);
  };

  const handleDelete = (e, deleteRow) => {
    const filtered = Object.keys(selectedFile).reduce((acc, key) => {
      if (Number(key) === Number(deleteRow.id)) {
        console.log('hello');
        return acc;
      }
      return {
        ...acc,
        [key]: selectedFile[key],
      };
    }, {});
    setSelectedFile(filtered);
  };

  useEffect(() => {
    setFileNum(Object.keys(selectedFile).length);
    setTableData(Object.keys(selectedFile).map((key) => selectedFile[key]));
  }, [selectedFile]);

  return (
    <>
      <div className={`${classes.wrapper}`}>
        <div className={`${classes.alignedTextWrapper} ${classes.alignedTextWrapperMd}`}>
          <Typography variant="body1" className={classes.fieldAlignedText}>
            {text}
          </Typography>
        </div>
        <label htmlFor="upload-file">
          <input
            style={{ display: 'none' }}
            id="upload-file"
            name="upload-file"
            type="file"
            accept=".in, .out"
            onChange={(e) => handleUploadFile(e)}
            multiple
          />
          <Button
            className={classes.browseButton}
            variant="outlined"
            color="primary"
            component="span"
            startIcon={<Icon.Folder />}
          >
            Browse
          </Button>
        </label>
        {fileNum !== 0 && (
          <Typography variant="body2" className={classes.fieldAlignedText}>
            {fileNum}
            {' '}
            files selected
          </Typography>
        )}
      </div>
      {fileNum !== 0 && (
        <Paper className={classes.root} elevation={0}>
          <TableContainer className={classes.container}>
            <Table>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell
                    key="input"
                    align="center"
                    style={{ minWidth: 150, width: 150, border: 'none' }}
                    className={classes.fileNameCell}
                  >
                    <div className={classes.column}>
                      <b>Input File</b>
                    </div>
                  </TableCell>
                  <TableCell
                    key="output"
                    align="center"
                    style={{ minWidth: 150, width: 150, border: 'none' }}
                    className={classes.fileNameCell}
                  >
                    <div className={classes.column}>
                      <b>Output File</b>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className={classes.row}>
                    <TableCell align="center" className={classes.fileNameCell}>
                      <Typography variant="body2">
                        {row.in === undefined || row.in === null ? '' : row.in.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" className={classes.fileNameCell}>
                      <Typography variant="body2">
                        {row.out === undefined || row.out === null ? '' : row.out.name}
                      </Typography>
                    </TableCell>
                    <TableCell className={classes.deleteCell} align="right">
                      <Icon.Trash
                        className={classes.deleteIcon}
                        onClick={(e) => {
                          handleDelete(e, row);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={errorPopup}
        onClose={() => setErrorPopup(false)}
        message="Filename does not match the naming format"
        key="errorMsg"
      />
    </>
  );
}
