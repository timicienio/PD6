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
  TextField,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import Icon from './icon/index';
import AlignedText from './AlignedText';

const useStyles = makeStyles((theme) => ({
  divider: {
    height: '1px',
    marginTop: '11px',
    border: `0px solid ${theme.palette.grey[300]}`,
    backgroundColor: theme.palette.grey[300],
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
  addMemberButton: {
    marginLeft: '270px',
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
  select: {
    width: '350px',
  },
}));

export default function AddTeamMemberArea({ text, selectedMember, setSelectedMember }) {
  const classes = useStyles();

  const [inputs, setInputs] = useState({
    name: '',
    role: 'Normal',
  });

  const [tableData, setTableData] = useState([]);
  const [memberNum, setMemberNum] = useState(0);
  const [index, setIndex] = useState(0);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((input) => ({ ...input, [name]: value }));
  };

  const handleAddMember = () => {
    if (inputs.name !== '') {
      const newSelectedMembers = [inputs].reduce(
        (acc, member) => ({
          ...acc,
          [index]: {
            id: index,
            name: member.name,
            role: member.role,
          },
        }),
        selectedMember,
      );

      // object to array
      setSelectedMember(newSelectedMembers);
      setIndex(index + 1);
      setInputs({
        name: '',
        role: 'Normal',
      });
    }
  };

  const handleDelete = (e, deleteRow) => {
    const filtered = Object.keys(selectedMember).reduce((acc, key) => {
      if (Number(key) === Number(deleteRow.id)) {
        return acc;
      }
      return {
        ...acc,
        [key]: selectedMember[key],
      };
    }, {});
    console.log(filtered);
    setSelectedMember(filtered);
  };

  useEffect(() => {
    setMemberNum(Object.keys(selectedMember).length);
    setTableData(Object.keys(selectedMember).map((key) => selectedMember[key]));
  }, [selectedMember]);

  return (
    <>
      <div className={`${classes.divider}`} />
      <AlignedText text={text} />
      <AlignedText text="Student" maxWidth="md" childrenType="field">
        <TextField
          name="name"
          placeholder="Student ID / Email / #Username"
          value={inputs.name}
          onChange={(e) => handleChange(e)}
        />
      </AlignedText>
      <AlignedText text="Role" childrenType="field">
        <FormControl variant="outlined" className={classes.select}>
          <Select name="role" value={inputs.role} onChange={(e) => handleChange(e)}>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
          </Select>
        </FormControl>
      </AlignedText>
      <Button
        className={classes.addMemberButton}
        variant="outlined"
        color="primary"
        startIcon={<Icon.AddBoxIcon />}
        onClick={handleAddMember}
      >
        Add Team member
      </Button>

      {memberNum !== 0 && (
        <Paper className={classes.root} elevation={0}>
          <TableContainer className={classes.container}>
            <Table>
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell
                    key="input"
                    align="center"
                    style={{ minWidth: 50, width: 80, border: 'none' }}
                    className={classes.fileNameCell}
                  >
                    <div className={classes.column}>
                      <b>Student</b>
                    </div>
                  </TableCell>
                  <TableCell
                    key="output"
                    align="center"
                    style={{ minWidth: 50, width: 80, border: 'none' }}
                    className={classes.fileNameCell}
                  >
                    <div className={classes.column}>
                      <b>Role</b>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} className={classes.row}>
                    <TableCell align="left" className={classes.fileNameCell}>
                      <Typography variant="body2">{row.name}</Typography>
                    </TableCell>
                    <TableCell align="left" className={classes.fileNameCell}>
                      <Typography variant="body2">{row.role}</Typography>
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
    </>
  );
}
