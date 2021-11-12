import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import moment from 'moment-timezone';

import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import NoMatch from '../../noMatch';
import SimpleBar from '../../ui/SimpleBar';
import AlignedText from '../../ui/AlignedText';
import PageTitle from '../../ui/PageTitle';
import { readAnnouncement, deleteAnnouncement } from '../../../actions/admin/system';
import AnnouncementEdit from './AnnouncementEdit';
import GeneralLoading from '../../GeneralLoading';

const useStyles = makeStyles(() => ({
  duration: {
    transform: 'translate(0, -4px)',
  },
}));

/* This is a level 4 component (page component) */
export default function AnnouncementSetting() {
  const classes = useStyles();
  const { announcementId } = useParams();
  const history = useHistory();

  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const announcements = useSelector((state) => state.announcements.byId);
  const allIds = useSelector((state) => state.announcements.allIds);
  const loading = useSelector((state) => state.loading.admin.system.fetchAnnouncement);
  const editLoading = useSelector((state) => state.loading.admin.system.editAnnouncement);

  const [popUpDelete, setPopUpDelete] = useState(false);
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    if (!editLoading) {
      dispatch(readAnnouncement(authToken, announcementId));
    }
  }, [authToken, dispatch, editLoading, announcementId]);

  useEffect(() => {
    const item = announcements[announcementId];
    if (item !== undefined) {
      setAnnouncement({
        title: item.title,
        PostTime: item.post_time,
        EndTime: item.expire_time,
        Content: item.content,
      });
    }
  }, [allIds, announcementId, announcements]);

  const handleClickDelete = () => {
    setPopUpDelete(true);
  };
  const handleClosePopUpDelete = () => {
    setPopUpDelete(false);
  };
  const handleSubmitDelete = () => {
    dispatch(deleteAnnouncement(authToken, announcementId));
    history.push('/admin/system/announcement');
  };

  const [edit, setEdit] = useState(false);
  /* TODO: re-write with ui components SimpleBar and DatePicker  */
  /* This is a level 4 component (page component) */
  if (announcement === null) {
    if (loading) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle text={`${announcement.title} / Setting`} />
      {edit ? (
        <AnnouncementEdit
          announcementId={announcementId}
          setEdit={setEdit}
          editTitle={announcement.title}
          editStartDate={announcement.PostTime}
          editEndDate={announcement.EndTime}
          editContent={announcement.Content}
        />
      ) : (
        <>
          <SimpleBar
            title="Announcement"
            buttons={(
              <>
                <Button onClick={() => setEdit(true)}>Edit</Button>
              </>
            )}
          >
            <AlignedText text="Title" childrenType="text">
              <Typography variant="body1">{announcement.title}</Typography>
            </AlignedText>
            <AlignedText text="Duration" childrenType="text">
              <Typography variant="body1" className={classes.duration}>
                {moment(announcement.PostTime).format('YYYY/MM/DD HH:mm')}
                <ArrowRightIcon style={{ transform: 'translate(0, 5px)' }} />
                {moment(announcement.EndTime).format('YYYY/MM/DD HH:mm')}
              </Typography>
            </AlignedText>
            <AlignedText text="Content" childrenType="text">
              <Typography variant="body1">{announcement.Content}</Typography>
            </AlignedText>
          </SimpleBar>
          <SimpleBar
            title="Delete Announcement"
            childrenButtons={(
              <>
                <Button color="secondary" onClick={handleClickDelete}>
                  Delete
                </Button>
              </>
            )}
          >
            <Typography className="delete-announcement-body" variant="body1">
              Once you delete this announcement, there is no going back. Please be certain.
            </Typography>
          </SimpleBar>
        </>
      )}

      {/* Delete dialog */}
      <Dialog open={popUpDelete} keepMounted onClose={handleClosePopUpDelete}>
        <DialogTitle>
          <Typography variant="h4">Delete Announcement</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            className="delete-announcement-detail"
            direction="row"
            justifyContent="center"
            alignContent="center"
          >
            <Grid container item className="delete-Announcement-detail-title" xs={6}>
              <Typography variant="body1" color="secondary">
                Title
              </Typography>
            </Grid>
            <Grid container item className="delete-class-detail-content" xs={6}>
              <Typography variant="body1" color="secondary">
                {announcement.title}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogContent>
          <Typography variant="body2">
            Once you delete an announcement, there is no going back. Please be certain.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopUpDelete}>Cancel</Button>
          <Button onClick={() => handleSubmitDelete()} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
