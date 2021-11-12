import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, TextField, makeStyles } from '@material-ui/core';
import moment from 'moment';
import DateRangePicker from '../../ui/DateRangePicker';
import SimpleBar from '../../ui/SimpleBar';
import AlignedText from '../../ui/AlignedText';
import PageTitle from '../../ui/PageTitle';
import { addAnnouncement } from '../../../actions/admin/system';

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

/* This is a level 4 component (page component) */
const AnnouncementAdd = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.user.id);

  const [addTitle, setAddTitle] = useState('');
  const [addContent, setAddContent] = useState('');

  const [dateRangePicker, setDateRangePicker] = useState([
    {
      startDate: moment().toDate(),
      endDate: moment().add(7, 'days').toDate(),
      key: 'selection',
    },
  ]);

  const history = useHistory();
  const backToHomePage = () => {
    history.push('/admin/system/announcement');
  };
  const handleClickSave = () => {
    const body = {
      title: addTitle,
      content: addContent,
      author_id: userId,
      post_time: dateRangePicker[0].startDate.toISOString(),
      expire_time: dateRangePicker[0].endDate.toISOString(),
    };
    dispatch(addAnnouncement(authToken, body));
    backToHomePage();
  };

  return (
    <>
      <PageTitle text="(Draft) / Setting" />
      <SimpleBar title="Announcement">
        <AlignedText text="Title" childrenType="field">
          <TextField value={addTitle} onChange={(e) => setAddTitle(e.target.value)} />
        </AlignedText>
        <AlignedText text="Duration" childrenType="field">
          <DateRangePicker className={classes.dateRangePicker} value={dateRangePicker} setValue={setDateRangePicker} />
        </AlignedText>
        <AlignedText text="Content" childrenType="field">
          <TextField
            className={classes.contentField}
            value={addContent}
            onChange={(e) => setAddContent(e.target.value)}
            multiline
            rows={4}
          />
        </AlignedText>
      </SimpleBar>
      {/* TODO: re-write with ui components SimpleBar and DatePicker  */}
      <div className={classes.buttons}>
        <Button onClick={backToHomePage}>Cancel</Button>
        <Button color="primary" onClick={handleClickSave}>
          Save
        </Button>
      </div>
    </>
  );
};

export default AnnouncementAdd;
