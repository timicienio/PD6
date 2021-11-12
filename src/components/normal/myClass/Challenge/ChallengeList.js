import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import AlignedText from '../../../ui/AlignedText';
import Icon from '../../../ui/icon/index';
import AutoTable from '../../../ui/AutoTable';
import PageTitle from '../../../ui/PageTitle';
import DateRangePicker from '../../../ui/DateRangePicker';
import { fetchChallenges, addChallenge } from '../../../../actions/myClass/challenge';
import GeneralLoading from '../../../GeneralLoading';
import NoMatch from '../../../noMatch';

const useStyles = makeStyles((theme) => ({
  textField: {
    width: 'auto',
    flexGrow: 1,
    flexShrink: 1,
  },
  dateRangePicker: {
    marginTop: '16px',
    marginBottom: '16px',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  item: {
    width: '190px',
  },
  selectList: {
    width: '350px',
  },
}));

/* This is a level 4 component (page component) */
export default function ChallengeList() {
  const { courseId, classId } = useParams();
  const className = useStyles();
  const dispatch = useDispatch();

  const [dateRangePicker, setDateRangePicker] = useState([
    {
      startDate: moment().toDate(),
      endDate: moment().add(7, 'days').toDate(),
      key: 'selection',
    },
  ]);

  const [popUp, setPopUp] = useState(false);
  const [inputs, setInputs] = useState({
    title: '',
    scoredBy: 'Last Score',
    showTime: 'On End Time',
  });
  const [disabled, setDisabled] = useState(true);
  const [isManager, setIsManager] = useState(false);

  const authToken = useSelector((state) => state.auth.token);
  const error = useSelector((state) => state.error.myClass.challenge);
  const loading = useSelector((state) => state.loading.myClass.challenge);
  const commonLoading = useSelector((state) => state.loading.common.common);
  const challenges = useSelector((state) => state.challenges);
  const classes = useSelector((state) => state.classes.byId);
  const courses = useSelector((state) => state.courses.byId);
  const userClasses = useSelector((state) => state.user.classes);

  const getStatus = (id) => {
    const currentTime = moment();
    if (currentTime.isBefore(moment(challenges.byId[id].start_time))) {
      return 'Not Yet';
    }
    if (currentTime.isBefore(moment(challenges.byId[id].end_time))) {
      return 'Opened';
    }
    return 'Closed';
  };

  useEffect(() => {
    if (userClasses.filter((item) => item.class_id === Number(classId))[0].role === 'MANAGER') {
      setIsManager(true);
    } else setIsManager(false);
  }, [classId, userClasses]);

  if (courses[courseId] === undefined || classes[classId] === undefined) {
    if (commonLoading.fetchClass || commonLoading.fetchCourse) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((input) => ({ ...input, [name]: value }));

    if (name === 'title' && value === '') {
      setDisabled(true);
    } else setDisabled(false);
  };

  const handleAdd = () => {
    const body = {
      title: inputs.title,
      scoredBy: inputs.scoredBy === 'Last Score' ? 'LAST' : 'BEST',
      showTime: inputs.showTime === 'On End Time' ? 'END_TIME' : 'START_TIME',
      startTime: dateRangePicker[0].startDate.toISOString(),
      endTime: dateRangePicker[0].endDate.toISOString(),
    };
    dispatch(addChallenge(authToken, classId, body));
    setDisabled(true);
    setPopUp(false);
    setInputs({
      title: '',
      scoredBy: 'Last Score',
      showTime: 'On End Time',
    });
    setDateRangePicker([
      {
        startDate: moment().toDate(),
        endDate: moment().add(7, 'days').toDate(),
        key: 'selection',
      },
    ]);
  };

  const handleCancel = () => {
    setPopUp(false);
    setDisabled(true);
    setInputs({
      title: '',
      scoredBy: 'Last Score',
      showTime: 'On End Time',
    });
    setDateRangePicker([
      {
        startDate: moment().toDate(),
        endDate: moment().add(7, 'days').toDate(),
        key: 'selection',
      },
    ]);
  };

  return (
    <>
      <PageTitle text={`${courses[courseId].name} ${classes[classId].name} / Challenge`} />
      <AutoTable
        ident={`Challenge list ${classId}`}
        buttons={
          isManager && (
            <>
              <Button color="primary" onClick={() => setPopUp(true)}>
                <Icon.Add style={{ color: 'white' }} />
              </Button>
            </>
          )
        }
        hasFilter
        filterConfig={[
          {
            reduxStateId: 'title',
            label: 'Title',
            type: 'TEXT',
            operation: 'LIKE',
          },
          {
            reduxStateId: 'status',
            label: 'Status',
            type: 'ENUM_SINGLE',
            operation: 'IN',
            options: [
              { value: 'Not Yet', label: 'Not Yet' },
              { value: 'Opened', label: 'Opened' },
              { value: 'Closed', label: 'Closed' },
            ],
          },
        ]}
        defaultSort={['start_time', 'DESC']}
        refetch={(browseParams, ident) => {
          dispatch(fetchChallenges(authToken, classId, browseParams, ident));
        }}
        refetchErrors={[error.fetchChallenges]}
        refreshLoadings={[loading.addChallenge]}
        columns={[
          {
            name: 'Title',
            align: 'center',
            width: 300,
            minWidth: 150,
            type: 'string',
          },
          {
            name: 'Start Time',
            align: 'center',
            width: 200,
            minWidth: 50,
            type: 'string',
          },
          {
            name: 'End Time',
            align: 'center',
            width: 200,
            minWidth: 50,
            type: 'string',
          },
          {
            name: 'Status',
            align: 'center',
            width: 132,
            minWidth: 50,
            type: 'string',
          },
        ]}
        reduxData={challenges}
        reduxDataToRows={(item) => ({
          id: item.id,
          Title: item.title,
          'Start Time': moment(item.start_time).format('YYYY-MM-DD, HH:mm'),
          'End Time': moment(item.end_time).format('YYYY-MM-DD, HH:mm'),
          Status: getStatus(item.id),
          link: `/my-class/${courseId}/${classId}/challenge/${item.id}`,
        })}
        hasLink
      />
      <Dialog open={popUp} keepMounted onClose={() => setPopUp(false)} maxWidth="md">
        <DialogTitle>
          <Typography variant="h4">Create New Challenge</Typography>
        </DialogTitle>
        <DialogContent>
          <AlignedText text="Class" childrenType="text" maxWidth="md">
            <Typography>{`${courses[courseId].name} ${classes[classId].name}`}</Typography>
          </AlignedText>
          <AlignedText text="Title" childrenType="field" maxWidth="md">
            <TextField
              className={className.textField}
              value={inputs.title}
              name="title"
              onChange={(e) => handleChange(e)}
            />
          </AlignedText>
          <Typography variant="body1">Duration</Typography>
          <DateRangePicker
            vertical
            value={dateRangePicker}
            setValue={setDateRangePicker}
            className={className.dateRangePicker}
          />
          <div className={className.row}>
            <div className={className.item}>
              <Typography>Scored by</Typography>
            </div>
            <FormControl variant="outlined" className={className.selectList}>
              <Select value={inputs.scoredBy} name="scoredBy" onChange={(e) => handleChange(e)}>
                <MenuItem value="Last Score">Last Score</MenuItem>
                <MenuItem value="Best Score">Best Score</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={className.row}>
            <div className={className.item}>
              <Typography>Shown in problem set</Typography>
            </div>
            <FormControl variant="outlined" className={className.selectList}>
              <Select value={inputs.showTime} name="showTime" onChange={(e) => handleChange(e)}>
                <MenuItem value="On End Time">On End Time</MenuItem>
                <MenuItem value="On Start Time">On Start Time</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="default">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary" disabled={disabled}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
