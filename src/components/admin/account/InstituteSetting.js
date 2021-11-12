import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  makeStyles,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import SimpleBar from '../../ui/SimpleBar';
import AlignedText from '../../ui/AlignedText';
import PageTitle from '../../ui/PageTitle';
import { getInstitute, editInstitute } from '../../../actions/admin/account';
import NoMatch from '../../noMatch';
import GeneralLoading from '../../GeneralLoading';

const useStyles = makeStyles(() => ({
  warningText: {
    marginTop: '10px',
  },
}));

export default function InstituteSetting() {
  const classes = useStyles();

  const { instituteId } = useParams();
  const institutes = useSelector((state) => state.institutes.byId);
  const authToken = useSelector((state) => state.auth.token);
  // const pageError = useSelector((state) => state.error.admin.account);
  const loading = useSelector((state) => state.loading.admin.account);

  const dispatch = useDispatch();

  const [settingStatus, setSettingStatus] = useState({
    changeName: false,
    changeInitialism: false,
    changeEmail: false,
    changeStatus: false,
  });

  const [newSetting, setNewSetting] = useState({
    newStatus: false,
    newName: '',
    newInitialism: '',
    newEmail: '',
  });

  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (!loading.editInstitute) {
      dispatch(getInstitute(authToken, instituteId));
    }
  }, [authToken, dispatch, instituteId, loading.editInstitute]);

  if (institutes[instituteId] === undefined) {
    if (loading.fetchInstitute) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  const handleClosePopUp = () => {
    setSettingStatus({
      changeName: false,
      changeInitialism: false,
      changeEmail: false,
      changeStatus: false,
    });
    setNewSetting({
      ...newSetting,
      newName: '',
      newInitialism: '',
      newEmail: '',
    });
  };

  const handleChange = (prop) => (event) => {
    setNewSetting((input) => ({ ...input, [prop]: event.target.value }));
    if (prop === 'newEmail' && error === true) {
      setError(false);
      setErrorText('');
    }
  };

  const handleChangeStatus = (event) => {
    setNewSetting((input) => ({ ...input, [event.target.name]: !event.target.checked }));
  };

  const handleEditInstitute = (prop) => {
    if (newSetting.newEmail === '' && prop === 'newEmail') {
      setError(true);
      setErrorText("Can't be empty!");
      return;
    }
    switch (prop) {
      case 'newName':
        dispatch(
          editInstitute(
            authToken,
            instituteId,
            institutes[instituteId].abbreviated_name,
            newSetting.newName,
            institutes[instituteId].email_domain,
            institutes[instituteId].is_disabled === true,
          ),
        );
        break;
      case 'newInitialism':
        dispatch(
          editInstitute(
            authToken,
            instituteId,
            newSetting.newInitialism,
            institutes[instituteId].full_name,
            institutes[instituteId].email_domain,
            institutes[instituteId].is_disabled === true,
          ),
        );
        break;
      case 'newEmail':
        dispatch(
          editInstitute(
            authToken,
            instituteId,
            institutes[instituteId].abbreviated_name,
            institutes[instituteId].full_name,
            newSetting.newEmail,
            institutes[instituteId].is_disabled === true,
          ),
        );
        break;
      case 'newStatus':
        dispatch(
          editInstitute(
            authToken,
            instituteId,
            institutes[instituteId].abbreviated_name,
            institutes[instituteId].full_name,
            institutes[instituteId].email_domain,
            newSetting.newStatus,
          ),
        );
        break;
      default:
        dispatch(
          editInstitute(
            authToken,
            instituteId,
            institutes[instituteId].abbreviated_name,
            institutes[instituteId].full_name,
            institutes[instituteId].email_domain,
            institutes[instituteId].is_disabled === true,
          ),
        );
    }
    handleClosePopUp();
  };

  return (
    <>
      <PageTitle text={`${institutes[instituteId].abbreviated_name} / Setting`} />
      <SimpleBar title="Institute Information">
        <AlignedText text="Full Name" maxWidth="lg" childrenType="text">
          <Typography variant="body1">{institutes[instituteId].full_name}</Typography>
        </AlignedText>
        <AlignedText text="Initialism" maxWidth="lg" childrenType="text">
          <Typography variant="body1">{institutes[instituteId].abbreviated_name}</Typography>
        </AlignedText>
        <AlignedText text="Email" maxWidth="lg" childrenType="text">
          <Typography variant="body1">{institutes[instituteId].email_domain}</Typography>
        </AlignedText>
        <AlignedText text="Status" maxWidth="lg" childrenType="text">
          <Typography variant="body1">
            {institutes[instituteId].is_disabled === true ? 'Disabled' : 'Enabled'}
          </Typography>
        </AlignedText>
      </SimpleBar>
      <SimpleBar
        title="Change Institute Full Name"
        childrenButtons={(
          <>
            <Button
              color="secondary"
              onClick={() => {
                setSettingStatus((input) => ({ ...input, changeName: true }));
              }}
            >
              Rename
            </Button>
          </>
        )}
      >
        <Typography variant="body1">
          Once you change the institute’s name, all related members will be affected. Please be certain.
        </Typography>
      </SimpleBar>
      <SimpleBar
        title="Change Institute Initialism"
        childrenButtons={(
          <>
            <Button
              color="secondary"
              onClick={() => {
                setSettingStatus((input) => ({ ...input, changeInitialism: true }));
              }}
            >
              Rename
            </Button>
          </>
        )}
      >
        <Typography variant="body1">
          Once you change the institute’s initialism, all related members will be affected. Please be certain.
        </Typography>
      </SimpleBar>
      <SimpleBar
        title="Change Institute Email"
        childrenButtons={(
          <>
            <Button
              color="secondary"
              onClick={() => {
                setSettingStatus((input) => ({ ...input, changeEmail: true }));
              }}
            >
              Change Email
            </Button>
          </>
        )}
      >
        <Typography variant="body1">
          Once you change the institute’s email, future members may not be able to register with certain email. Please
          be certain.
        </Typography>
      </SimpleBar>
      <SimpleBar
        title="Change Institute Status"
        childrenButtons={(
          <>
            <Button
              color="secondary"
              onClick={() => {
                setSettingStatus((input) => ({ ...input, changeStatus: true }));
                setNewSetting((input) => ({ ...input, newStatus: institutes[instituteId].is_disabled }));
              }}
            >
              Change Status
            </Button>
          </>
        )}
      >
        <Typography variant="body1">
          Once you change the institute’s status, future members from this institute may not be able to register. Please
          be certain.
        </Typography>
      </SimpleBar>

      <Dialog open={settingStatus.changeName} keepMounted onClose={() => handleClosePopUp()} fullWidth maxWidth="sm">
        <DialogTitle id="dialog-slide-title">
          <Typography variant="h4">Rename institute</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Full Name" childrenType="text" textColor="secondary">
            <Typography variant="body1">{institutes[instituteId].full_name}</Typography>
          </AlignedText>
          <AlignedText text="New Name" childrenType="field">
            <TextField id="newName" name="newName" value={newSetting.newName} onChange={handleChange('newName')} />
          </AlignedText>
          <Typography variant="body1" className={classes.warningText}>
            Once you change the institute’s name, all related members will be affected. Please be certain.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClosePopUp()} color="default">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleEditInstitute('newName');
            }}
            color="secondary"
            disabled={newSetting.newName === ''}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={settingStatus.changeInitialism}
        keepMounted
        onClose={() => handleClosePopUp()}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="dialog-slide-title">
          <Typography variant="h4">Change institute Initialism</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Current Initialism" childrenType="text" textColor="secondary">
            <Typography variant="body1">{institutes[instituteId].abbreviated_name}</Typography>
          </AlignedText>
          <AlignedText text="New Initialism" childrenType="field">
            <TextField
              id="newInitialism"
              name="newInitialism"
              value={newSetting.newInitialism}
              onChange={handleChange('newInitialism')}
            />
          </AlignedText>
          <Typography variant="body1" className={classes.warningText}>
            Once you change the institute’s initialism, all related members will be affected. Please be certain.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClosePopUp()} color="default">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleEditInstitute('newInitialism');
            }}
            color="secondary"
            disabled={newSetting.newInitialism === ''}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={settingStatus.changeEmail} keepMounted onClose={() => handleClosePopUp()} fullWidth maxWidth="sm">
        <DialogTitle id="dialog-slide-title">
          <Typography variant="h4">Change institute email</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Current Email" childrenType="text" textColor="secondary">
            <Typography variant="body1">{institutes[instituteId].email_domain}</Typography>
          </AlignedText>
          <AlignedText text="New Email" childrenType="field">
            <TextField
              id="newEmail"
              name="newEmail"
              value={newSetting.newEmail}
              onChange={handleChange('newEmail')}
              error={error}
              helperText={errorText}
            />
          </AlignedText>
          <Typography variant="body1" className={classes.warningText}>
            Once you change the institute’s email, future members may not be able to register with certain email. Please
            be certain.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClosePopUp()} color="default">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleEditInstitute('newEmail');
            }}
            color="secondary"
            disabled={newSetting.newEmail === ''}
          >
            Modify
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={settingStatus.changeStatus} keepMounted onClose={() => handleClosePopUp()} fullWidth maxWidth="sm">
        <DialogTitle id="dialog-slide-title">
          <Typography variant="h4">Rename institute</Typography>
        </DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Switch checked={!newSetting.newStatus} onChange={handleChangeStatus} name="newStatus" color="primary" />
            }
            label={newSetting.newStatus ? 'Disable' : 'Enable'}
          />
          <Typography variant="body1" className={classes.warningText}>
            Once you change the institute’s status, future members from this institute may not be able to register.
            Please be certain.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClosePopUp()} color="default">
            Cancel
          </Button>
          <Button
            disabled={institutes[instituteId].is_disabled === newSetting.newStatus}
            onClick={() => handleEditInstitute('newStatus')}
            color="secondary"
          >
            Modify
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
