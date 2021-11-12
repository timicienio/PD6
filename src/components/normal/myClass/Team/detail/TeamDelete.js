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
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import SimpleBar from '../../../../ui/SimpleBar';
import AlignedText from '../../../../ui/AlignedText';
import { deleteTeam } from '../../../../../actions/myClass/team';

const useStyles = makeStyles(() => ({}));

export default function TeamDelete(props) {
  const classes = useStyles();
  const [popUp, setPopUp] = useState(false);
  const history = useHistory();
  const { courseId, classId, teamId } = useParams();
  const authToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [errorPopup, setErrorPopup] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = () => {
    dispatch(deleteTeam(authToken, teamId, () => { history.push(`/my-class/${courseId}/${classId}/team`); }, (error) => { setDeleteError(error); setErrorPopup(true); }));
    setPopUp(false);
  };

  return (
    <div>
      <SimpleBar
        title="Delete Team"
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
        <Typography>Once you delete a team, there is no going back. Please be certain.</Typography>
      </SimpleBar>

      <Dialog open={popUp} onClose={() => setPopUp(false)} maxWidth="md">
        <DialogTitle>
          <Typography variant="h4">Delete Team</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="body1" color="secondary">
            <AlignedText text="Team Name" childrenType="text" textColor="secondary">
              <Typography>{props.teamName}</Typography>
            </AlignedText>
            <AlignedText text="Label" childrenType="text" textColor="secondary">
              <Typography>{props.label}</Typography>
            </AlignedText>
            <Typography variant="body2" color="textPrimary">
              Once you delete a team, there is no going back. Please be certain.
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
