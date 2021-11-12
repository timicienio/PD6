import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useBeforeunload } from 'react-beforeunload';
import {
  Typography,
  Button,
  Card,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { fetchClassMemberWithAccountReferral, replaceClassMembers } from '../../../../actions/common/common';
import { getUserInfo } from '../../../../actions/user/auth';

const useStyles = makeStyles(() => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  editorCol: {
    display: 'flex',
    flexDirection: 'column',
    margin: '16px 23px 16px 23px',
    width: '26.4%',
  },
  editorItem: {
    marginBottom: '12px',
  },
  textField: {
    width: '100%',
    marginTop: '0px',
  },
  buttonsBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '50px',
  },
  leftButton: {
    marginRight: '18px',
  },
  dialogContent: {
    padding: '0px 24px 6px 24px',
  },
  failedList: {
    marginTop: '16px',
  },
  dialogButtons: {
    justifyContent: 'space-between',
  },
  backToEditButton: {
    marginLeft: '24px',
  },
  buttonFlexEnd: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}));

/* This is a level 4 component (page component) */
const MemberEdit = ({
  dispatch, authToken, classes, classId, backToMemberList,
}) => {
  const classNames = useStyles();

  const accounts = useSelector((state) => state.accounts);
  const members = useSelector((state) => state.classMembers);
  const error = useSelector((state) => state.error.common.common);

  const [TA, setTA] = useState([]);
  const [student, setStudent] = useState([]);
  const [guest, setGuest] = useState([]);
  const [TAChanged, setTAChanged] = useState(false);
  const [studentChanged, setStudentChanged] = useState(false);
  const [guestChanged, setGuestChanged] = useState(false);
  const [duplicateList, setDuplicateList] = useState([]);
  const [errorDetectedList, setErrorDetectedList] = useState([]);
  const [submitError, setSubmitError] = useState(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState(false);
  const [showDuplicateIdentityDialog, setShowDuplicateIdentityDialog] = useState(false);
  const [showErrorDetectedDialog, setShowErrorDetectedDialog] = useState(false);
  const [cookies] = useCookies(['id']);
  const unblockHandle = useRef();
  const targetLocation = useRef();
  const history = useHistory();

  // unblock user leaving current page through header and sidebar links
  // and push to original target location if necessary
  const unblockAndReturn = (needRedirection) => {
    backToMemberList();
    if (unblockHandle) {
      setShowDuplicateIdentityDialog(false);
      setShowErrorDetectedDialog(false);
      unblockHandle.current();
      if (needRedirection) {
        history.push(targetLocation.current);
      }
    }
  };
  // remove empty elements in an array
  const handleBlankList = (list) => list.filter((element) => element !== '' && element.account_referral !== '');

  useEffect(() => {
    dispatch(fetchClassMemberWithAccountReferral(authToken, classId));
  }, [authToken, classId, dispatch]);

  useEffect(() => {
    const classMembers = classes.byId[classId].memberIds.map((id) => members.byId[id]);
    if (classMembers !== undefined) {
      setTA(
        classMembers
          .filter((item) => item.role === 'MANAGER')
          .map((member) => accounts.byId[member.account_id].referral)
          .join('\n'),
      );
      setStudent(
        classMembers
          .filter((item) => item.role === 'NORMAL')
          .map((member) => accounts.byId[member.account_id].referral)
          .join('\n'),
      );
      setGuest(
        classMembers
          .filter((item) => item.role === 'GUEST')
          .map((member) => accounts.byId[member.account_id].referral)
          .join('\n'),
      );
    }
  }, [accounts.byId, classId, classes.byId, members.byId]);

  // block user leaving current page through header and sidebar links (if contents have been changed)
  useEffect(() => {
    unblockHandle.current = history.block((tl) => {
      if (TAChanged || studentChanged || guestChanged) {
        setShowUnsavedChangesDialog(true);
        targetLocation.current = tl;
        return false;
      }
      return true;
    });
  }, [TAChanged, guestChanged, history, studentChanged]);

  useEffect(() => {
    if (error.replaceClassMembers) {
      setSubmitError(error.replaceClassMembers);
    } else {
      setSubmitError(false);
    }
  }, [error.replaceClassMembers]);

  // block user leaving current page through browser close button and refresh button
  // (if any dialog is shown, or contents have been changed)
  useBeforeunload((e) => {
    if (showErrorDetectedDialog || showDuplicateIdentityDialog) {
      e.preventDefault();
    } else if (TAChanged || studentChanged || guestChanged) {
      e.preventDefault();
      setShowUnsavedChangesDialog(true);
    }
  });

  const handleChangeTA = (e) => {
    setTA(e.target.value);
    setTAChanged(
      e.target.value
        !== classes.byId[classId].memberIds
          .map((id) => members.byId[id])
          .filter((item) => item.role === 'MANAGER')
          .map((member) => accounts.byId[member.account_id].referral)
          .join('\n'),
    );
  };
  const handleChangeStudent = (e) => {
    setStudent(e.target.value);
    setStudentChanged(
      e.target.value
        !== classes.byId[classId].memberIds
          .map((id) => members.byId[id])
          .filter((item) => item.role === 'NORMAL')
          .map((member) => accounts.byId[member.account_id].referral)
          .join('\n'),
    );
  };
  const handleChangeGuest = (e) => {
    setGuest(e.target.value);
    setGuestChanged(
      e.target.value
        !== classes.byId[classId].memberIds
          .map((id) => members.byId[id])
          .filter((item) => item.role === 'GUEST')
          .map((member) => accounts.byId[member.account_id].referral)
          .join('\n'),
    );
  };

  const handleClickCancel = () => {
    if (TAChanged || studentChanged || guestChanged) {
      setShowUnsavedChangesDialog(true);
    } else {
      unblockAndReturn(false);
    }
  };
  const handleUnsave = () => {
    setShowUnsavedChangesDialog(false);
    unblockAndReturn(true);
  };
  const handleSave = (saveWithDialog) => {
    setShowUnsavedChangesDialog(false);

    if (TAChanged || studentChanged || guestChanged) {
      const TAStudentDuplicateList = TA.split('\n').filter(
        (id) => student
          .split('\n')
          .map((accountReferral) => accountReferral)
          .indexOf(id) !== -1,
      );
      const guestStudentDuplicateList = guest.split('\n').filter(
        (id) => student
          .split('\n')
          .map((accountReferral) => accountReferral)
          .indexOf(id) !== -1,
      );
      const guestTADuplicateList = guest.split('\n').filter(
        (id) => TA.split('\n')
          .map((accountReferral) => accountReferral)
          .indexOf(id) !== -1,
      );

      const combinedDuplicateList = handleBlankList(
        TAStudentDuplicateList.concat(guestStudentDuplicateList, guestTADuplicateList),
      );
      setDuplicateList(combinedDuplicateList);

      if (combinedDuplicateList.length !== 0) {
        setShowDuplicateIdentityDialog(true);
      } else {
        const TATransformedList = TA.split('\n').map((accountReferral) => ({
          account_referral: accountReferral,
          role: 'MANAGER',
        }));
        const studentTransformedList = student.split('\n').map((accountReferral) => ({
          account_referral: accountReferral,
          role: 'NORMAL',
        }));
        const guestTransformedList = guest.split('\n').map((accountReferral) => ({
          account_referral: accountReferral,
          role: 'GUEST',
        }));

        const replacingList = handleBlankList(TATransformedList.concat(studentTransformedList, guestTransformedList));

        // if data is saved with dialog, redirection is needed
        dispatch(
          replaceClassMembers(
            authToken,
            classId,
            replacingList,
            () => {
              unblockAndReturn(saveWithDialog);
              dispatch(getUserInfo(cookies.id, authToken));
            },
            (list) => {
              setErrorDetectedList(list);
              setShowErrorDetectedDialog(true);
            },
          ),
        );
      }
    } else {
      unblockAndReturn(false);
    }
  };

  return (
    <div>
      <Typography variant="body1">
        Account: NTU Student ID, Institute Email or #Username (priority from high to low accordingly)
      </Typography>
      <br />
      <Card className={classNames.card} variant="outlined">
        <div className={classNames.editorCol}>
          <div className={classNames.editorItem}>
            <Typography variant="body1">TA</Typography>
          </div>
          <div className={classNames.editorItem}>
            <Typography variant="caption">List of accounts</Typography>
          </div>
          <TextField
            className={classNames.textField}
            value={TA}
            onChange={(e) => handleChangeTA(e)}
            multiline
            rows={20}
            placeholder="B01234567&#10;aaa@ntnu.edu.tw&#10;#pdogs"
          />
        </div>
        <div className={classNames.editorCol}>
          <div className={classNames.editorItem}>
            <Typography variant="body1">Student</Typography>
          </div>
          <div className={classNames.editorItem}>
            <Typography variant="caption">List of accounts</Typography>
          </div>
          <TextField
            className={classNames.textField}
            value={student}
            onChange={(e) => handleChangeStudent(e)}
            multiline
            rows={20}
            placeholder="B01234567&#10;aaa@ntnu.edu.tw&#10;#pdogs"
          />
        </div>
        <div className={classNames.editorCol}>
          <div className={classNames.editorItem}>
            <Typography variant="body1">Guest</Typography>
          </div>
          <div className={classNames.editorItem}>
            <Typography variant="caption">List of accounts</Typography>
          </div>
          <TextField
            className={classNames.textField}
            value={guest}
            onChange={(e) => handleChangeGuest(e)}
            multiline
            rows={20}
            placeholder="B01234567&#10;aaa@ntnu.edu.tw&#10;#pdogs"
          />
        </div>
      </Card>
      <div className={classNames.buttonsBar}>
        <Button onClick={handleClickCancel} className={classNames.leftButton}>
          Cancel
        </Button>
        <Button onClick={() => handleSave(false)} color="primary">
          Save
        </Button>
      </div>

      <Dialog open={showUnsavedChangesDialog} maxWidth="md">
        <DialogTitle>
          <Typography variant="h4">Unsaved Changes</Typography>
        </DialogTitle>
        <DialogContent className={classNames.dialogContent}>
          <Typography variant="body1">
            You have unsaved changes, do you want to save your changes or back to edit?
          </Typography>
        </DialogContent>
        <DialogActions className={classNames.dialogButtons}>
          <Button
            variant="outlined"
            onClick={() => setShowUnsavedChangesDialog(false)}
            className={classNames.backToEditButton}
          >
            Back to Edit
          </Button>
          <div>
            <Button onClick={handleUnsave}>Don’t Save</Button>
            <Button onClick={() => handleSave(true)} color="primary">
              Save
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      <Dialog open={showDuplicateIdentityDialog} maxWidth="md">
        <DialogTitle>
          <Typography variant="h4">Duplicate Identity</Typography>
        </DialogTitle>
        <DialogContent className={classNames.dialogContent}>
          <Typography variant="body1">
            The following accounts appear in more than one column. Please remove duplicate identities.
          </Typography>
          <div className={classNames.failedList}>
            {duplicateList.map((accountReferral) => (
              <Typography variant="body1" key={`duplicate-${accountReferral}`}>
                {accountReferral}
              </Typography>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => setShowDuplicateIdentityDialog(false)}
            className={classNames.buttonFlexEnd}
          >
            Back to Edit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showErrorDetectedDialog} maxWidth="md">
        <DialogTitle>
          <Typography variant="h4">Error Detected</Typography>
        </DialogTitle>
        <DialogContent className={classNames.dialogContent}>
          {submitError ? (
            <>
              <Typography variant="body1">Save member failed due to the following reasons:</Typography>
              <Typography variant="body1" className={classNames.failedList}>
                {submitError === 'SystemException' ? 'System Exception' : submitError}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body1">Changes saved, but error detected in the following accounts:</Typography>
              <div className={classNames.failedList}>
                {errorDetectedList.map((accountReferral) => (
                  <Typography variant="body1" key={`errorDetected-${accountReferral}`}>
                    {accountReferral}
                  </Typography>
                ))}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {submitError ? (
            <Button
              color="primary"
              onClick={() => setShowErrorDetectedDialog(false)}
              className={classNames.buttonFlexEnd}
            >
              Back to Edit
            </Button>
          ) : (
            <Button color="primary" onClick={handleUnsave} className={classNames.buttonFlexEnd}>
              Back to Member List
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MemberEdit;
