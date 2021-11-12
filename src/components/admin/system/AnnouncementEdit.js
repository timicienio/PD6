import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField, makeStyles } from '@material-ui/core';
import moment from 'moment-timezone';

import SimpleBar from '../../ui/SimpleBar';
import DateRangePicker from '../../ui/DateRangePicker';
import AlignedText from '../../ui/AlignedText';
import { editAnnouncement } from '../../../actions/admin/system';

const useStyles = makeStyles(() => ({
  contentField: {
    width: '720px',
  },
  dateRangePicker: {
    marginTop: '15px',
    marginBottom: '9px',
  },
  buttons: {
    marginTop: '-32px',
    marginLeft: '-5px',
  },
}));

export default function AnnouncementEdit(props) {
  const classes = useStyles();

  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);

  const [editTitle, setEditTitle] = useState(props.editTitle);
  const [dateRangePicker, setDateRangePicker] = useState([
    {
      startDate: moment(props.editStartDate).toDate(),
      endDate: moment(props.editEndDate).toDate(),
      key: 'selection',
    },
  ]);
  const [editContent, setEditContent] = useState(props.editContent);

  const handleClickSave = () => {
    const body = {
      title: editTitle,
      content: editContent,
      post_time: dateRangePicker[0].startDate.toISOString(),
      expire_time: dateRangePicker[0].endDate.toISOString(),
    };
    dispatch(editAnnouncement(authToken, props.announcementId, body));
    props.setEdit(false);
  };

  /* This is a level 4 component (page component) */
  return (
    <>
      <SimpleBar title="Announcement">
        <AlignedText text="Title" childrenType="field">
          <TextField defaultValue={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
        </AlignedText>
        <AlignedText text="Duration" childrenType="field">
          <DateRangePicker className={classes.dateRangePicker} value={dateRangePicker} setValue={setDateRangePicker} />
        </AlignedText>
        <AlignedText text="Content" childrenType="field">
          <TextField
            className={classes.contentField}
            defaultValue={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            multiline
            rows={4}
          />
        </AlignedText>
      </SimpleBar>
      <div className={classes.buttons}>
        <Button onClick={() => props.setEdit(false)}>Cancel</Button>
        <Button color="primary" onClick={handleClickSave}>
          Save
        </Button>
      </div>
    </>
  );
}
