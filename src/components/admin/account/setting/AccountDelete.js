import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogContentText,
  DialogActions,
  makeStyles,
  Snackbar,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { deleteAccount } from '../../../../actions/admin/account';
import SimpleBar from '../../../ui/SimpleBar';
import AlignedText from '../../../ui/AlignedText';

const useStyles = makeStyles(() => ({}));

export default function AccountDelete(props) {
  const classes = useStyles();
  const [popUp, setPopUp] = useState(false);
  const history = useHistory();
  const { accountId } = useParams();
  const authToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const card = props.cards.filter((p) => p.is_default === true);
  const deleteLoading = useSelector((state) => state.loading.admin.account.deleteAccount);
  const deleteError = useSelector((state) => state.error.admin.account.deleteAccount);
  const [hasRequest, setHasRequest] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);

  const handleDelete = () => {
    dispatch(deleteAccount(authToken, accountId));
    setHasRequest(true);
    setPopUp(false);
    // history.push('/');
  };

  useEffect(() => {
    if (!deleteLoading && hasRequest) {
      if (deleteError !== null) {
        setErrorPopup(true);
      } else {
        setHasRequest(false);
        history.push('/admin/account/account');
      }
    }
  }, [deleteLoading, deleteError, hasRequest, history]);

  return (
    <div>
      <SimpleBar
        title="Delete Account"
        childrenButtons={(
          <>
            <Button
              color="secondary"
              onClick={() => {
                setPopUp(true);
              }}
            >
              Delete
            </Button>
          </>
        )}
      >
        <Typography>Once you delete this account, there is no going back. Please be certain.</Typography>
      </SimpleBar>
      {props.cards && (
        <Dialog open={popUp} onClose={() => setPopUp(false)} maxWidth="md">
          <DialogTitle>
            <Typography variant="h4">Delete account</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText variant="body1" color="secondary">
              <AlignedText text="Username" childrenType="text">
                <Typography>{props.userName}</Typography>
              </AlignedText>
              <AlignedText text="Student ID" childrenType="text">
                {card.length > 0 && <Typography>{card[0].student_id}</Typography>}
              </AlignedText>
              <AlignedText text="Real name" childrenType="text">
                <Typography>{props.realName}</Typography>
              </AlignedText>
              <AlignedText text="Email" childrenType="text">
                {card.length > 0 && <Typography>{card[0].email}</Typography>}
              </AlignedText>
              <Typography variant="body2" color="textPrimary">
                Once you delete a student information, there is no going back. Please be certain.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPopUp(false)}>Cancel</Button>
            <Button color="secondary" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={errorPopup}
        onClose={() => setErrorPopup(false)}
        message={`Error: ${deleteError}`}
        key="errorMsg"
        className={classes.snackbar}
      />
    </div>
  );
}
