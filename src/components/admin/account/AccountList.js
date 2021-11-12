import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  makeStyles,
  withStyles,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PageTitle from '../../ui/PageTitle';
import AutoTable from '../../ui/AutoTable';
import FileUploadArea from '../../ui/FileUploadArea';
import Icon from '../../ui/icon/index';
import { addAccount, downloadAccountFile, importAccount } from '../../../actions/admin/account';
import { browseAccountWithDefaultStudentId } from '../../../actions/api/view';

const useStyles = makeStyles((theme) => ({
  addDialogGap: {
    marginTop: '60px',
  },
  reminder: {
    color: theme.palette.grey.A700,
    marginLeft: theme.spacing(2),
  },
  importDialogButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: '19px',
  },
}));

const StyledButton = withStyles({
  outlined: {
    '& path': {
      fill: 'none !important',
    },
  },
})(Button);

export default function AccountList() {
  const classNames = useStyles();
  const dispatch = useDispatch();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [addInputs, setAddInputs] = useState({
    realName: '',
    userName: '',
    password1: '',
    password2: '',
    altMail: '',
  });
  const [showPassword, setShowPassword] = useState({ pw1: false, pw2: false });
  const [selectedFile, setSelectedFile] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [showSnackBar1, setShowSnackBar1] = useState(false);

  const accounts = useSelector((state) => state.accounts);
  const authToken = useSelector((state) => state.auth.token);
  const error = useSelector((state) => state.error.admin.account);
  const loading = useSelector((state) => state.loading.admin.account);
  const viewError = useSelector((state) => state.error.api.view.browseAccountWithDefaultStudentId);

  useEffect(() => {
    if (showImportDialog) {
      setIsDisabled(selectedFile.length === 0);
    } else if (showAddDialog) {
      setIsDisabled(
        addInputs.realName === ''
          || addInputs.userName === ''
          || addInputs.password1 === ''
          || addInputs.password2 === '',
      );
    }
  }, [
    addInputs.password1,
    addInputs.password2,
    addInputs.realName,
    addInputs.userName,
    selectedFile.length,
    showAddDialog,
    showImportDialog,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddInputs((input) => ({ ...input, [name]: value }));

    if (name === 'password1') {
      if (value === addInputs.password2) {
        setPwError(false);
        setErrorText('');
      }
    }

    if (name === 'password2') {
      if (value === addInputs.password1) {
        setPwError(false);
        setErrorText('');
      }
    }
  };

  const handleCancel = () => {
    setShowAddDialog(false);
    setShowImportDialog(false);
    setAddInputs({
      realName: '',
      userName: '',
      password1: '',
      password2: '',
      altMail: '',
    });
    setShowPassword({ pw1: false, pw2: false });
    setSelectedFile([]);
    setPwError(false);
    setErrorText('');
  };

  const addAccountSuccess = () => {
    setShowAddDialog(false);
    setAddInputs({
      realName: '',
      userName: '',
      password1: '',
      password2: '',
      altMail: '',
    });
    setPwError(false);
    setErrorText('');
    setShowPassword({ pw1: false, pw2: false });
  };

  const importAccountSuccess = () => {
    setSelectedFile([]);
    setShowImportDialog(false);
  };

  const handleSubmit = () => {
    if (showImportDialog) {
      dispatch(importAccount(authToken, selectedFile, importAccountSuccess, () => setShowSnackBar(true)));
    } else if (showAddDialog) {
      if (addInputs.password1 !== addInputs.password2) {
        setPwError(true);
        setErrorText("Passwords don't match");
        return;
      }
      dispatch(
        addAccount(
          authToken,
          addInputs.realName,
          addInputs.userName,
          addInputs.password1,
          addInputs.altMail,
          addAccountSuccess,
          () => setShowSnackBar1(true),
        ),
      );
    }
  };

  const downloadTemplate = () => {
    dispatch(downloadAccountFile(authToken));
    setShowImportDialog(false);
  };

  return (
    <>
      <PageTitle text="Account" />
      <AutoTable
        ident="Account Table"
        hasFilter
        hasLink
        filterConfig={[
          {
            reduxStateId: 'username',
            label: 'Username',
            type: 'TEXT',
            operation: 'LIKE',
          },
          {
            reduxStateId: 'student_id',
            label: 'Student ID',
            type: 'TEXT',
            operation: 'LIKE',
          },
          {
            reduxStateId: 'real_name',
            label: 'Real Name',
            type: 'TEXT',
            operation: 'LIKE',
          },
        ]}
        refetch={(browseParams, ident) => {
          dispatch(browseAccountWithDefaultStudentId(authToken, browseParams, ident));
        }}
        refetchErrors={[viewError]}
        refreshLoadings={[loading.addAccount, loading.importAccount]}
        columns={[
          {
            name: 'Username',
            width: 200,
            align: 'center',
            type: 'string',
            sortable: 'username',
          },
          {
            name: 'Student ID',
            width: 200,
            align: 'center',
            type: 'string',
            sortable: 'student_id',
          },
          {
            name: 'Real Name',
            width: 200,
            align: 'center',
            type: 'string',
            sortable: 'real_name',
          },
        ]}
        reduxData={accounts}
        reduxDataToRows={(item) => ({
          id: item.id,
          Username: item.username,
          'Student ID': item.student_id,
          'Real Name': item.real_name,
          link: `/admin/account/account/${item.id}/setting`,
        })}
        buttons={(
          <>
            <Button variant="outlined" color="primary" onClick={() => setShowAddDialog(true)}>
              <Icon.Add />
            </Button>
            <Button color="primary" onClick={() => setShowImportDialog(true)} startIcon={<Icon.Folder />}>
              Import
            </Button>
          </>
        )}
      />
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} maxWidth="sm">
        <DialogTitle id="dialog-slide-title">
          <Typography variant="h4">Create Account</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            name="realName"
            value={addInputs.realName}
            placeholder="Real Name"
            onChange={(e) => handleChange(e)}
          />
          <TextField
            name="userName"
            value={addInputs.userName}
            placeholder="Username"
            className={classNames.addDialogGap}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            name="password1"
            value={addInputs.password1}
            placeholder="Password"
            className={classNames.addDialogGap}
            onChange={(e) => handleChange(e)}
            type={showPassword.pw1 ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setShowPassword({ ...showPassword, pw1: !showPassword.pw1 });
                    }}
                    edge="end"
                  >
                    {showPassword.pw1 ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            name="password2"
            value={addInputs.password2}
            placeholder="Confirm Password"
            className={classNames.addDialogGap}
            onChange={(e) => handleChange(e)}
            type={showPassword.pw2 ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setShowPassword({ ...showPassword, pw2: !showPassword.pw2 });
                    }}
                    edge="end"
                  >
                    {showPassword.pw2 ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={pwError}
            helperText={errorText}
          />
          <TextField
            name="altMail"
            value={addInputs.altMail}
            placeholder="Alternative Email"
            className={classNames.addDialogGap}
            onChange={(e) => handleChange(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="default">
            Cancel
          </Button>
          <Button disabled={isDisabled} onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSnackBar1}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackBar1(false);
        }}
        message={`Error: ${error.addAccount}`}
      />

      <Dialog open={showImportDialog} onClose={() => setShowImportDialog(false)} maxWidth="md">
        <DialogTitle id="dialog-slide-title">
          <Typography variant="h4">Import Account</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">Account file format:</Typography>
          <Typography variant="body2" className={classNames.reminder}>
            Real Name: String
          </Typography>
          <Typography variant="body2" className={classNames.reminder}>
            Username: String (Not repeatable)
          </Typography>
          <Typography variant="body2" className={classNames.reminder}>
            Password: String
          </Typography>
          <Typography variant="body2" className={classNames.reminder}>
            AlternativeEmail: String
          </Typography>
          <Typography variant="body2" className={classNames.reminder}>
            Nickname: String (Optional)
          </Typography>
          <Typography variant="body2">
            Notice that PDOGS only accept files encoded in
            {' '}
            <b>ASCII / UTF-8</b>
            {' '}
            charset.
          </Typography>
        </DialogContent>
        <DialogContent>
          <FileUploadArea
            text="File"
            fileAcceptFormat=".csv"
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        </DialogContent>
        <DialogActions className={classNames.importDialogButtons}>
          <StyledButton
            variant="outlined"
            startIcon={<Icon.Download />}
            onClick={() => {
              downloadTemplate();
            }}
          >
            Template
          </StyledButton>
          <div>
            <Button onClick={handleCancel} color="default">
              Cancel
            </Button>
            <Button disabled={isDisabled} onClick={handleSubmit} color="primary">
              Confirm
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={showSnackBar}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackBar(false);
        }}
        message={`Error: ${error.importAccount}`}
      />
    </>
  );
}
