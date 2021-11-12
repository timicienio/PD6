import { FormControl, makeStyles, TextField } from '@material-ui/core';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: '#ffffff',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #CACACA',
    padding: '20px 30px 20px 30px',
    width: '720px',
    display: 'flex',
    flexDirection: 'row',
  },
  wrapperVertical: {
    background: '#ffffff',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid #CACACA',
    padding: '20px 30px 20px 30px',
    width: '540px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  // startDate: {
  //   display: 'flex',
  //   flexDirection: 'row',
  // },
  fieldsWrapper: {
    marginTop: '10px',
    marginLeft: '45px',
  },
  fieldsWrapperVertical: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '22px',
    width: '100%',
    // flexWrap: 'nowrap',
    marginBottom: '17px',
    // marginLeft: '45px',
  },

  dateField: {
    width: '147px',
    marginRight: '4px',
    '& div': {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  },

  startDateField: {
    marginTop: '5px',
  },
  endDateField: {
    marginTop: '40px',
  },

  startDateFieldVertical: {
    // marginTop: '24px',
    marginRight: '9px',
  },
  endDateFieldVertical: {
    // marginTop: '24px',
    marginLeft: '9px',
  },

  timeField: {
    width: '79px',
    marginLeft: '0',
    '& div': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
  },
}));

const dateFormatExamples = [
  '9 27 2021',
  '09272021',
  '092721',
  'sep 27 2021',
  'Sep 27 2021',
  'SEP 27 2021',
  'sep 27, 2021',
  'Sep 27, 2021',
  'SEP 27, 2021',
];
const timeFormatExamples = ['9:10', '13:15', '1530', '150', '930', '900'];

export default function DateRangePicker({
  className = '', value, setValue, vertical,
}) {
  const classes = useStyles();

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const [timePlaceHolder, setTimePlaceHolder] = useState(0);
  const [datePlaceHolder, setDatePlaceHolder] = useState(0);

  // suggestion on input formats
  useEffect(() => {
    const interval = setInterval(() => {
      setTimePlaceHolder((prev) => (prev + 1) % timeFormatExamples.length);
      setDatePlaceHolder((prev) => (prev + 1) % dateFormatExamples.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setStartDate(moment(value[0].startDate).format('MMM DD, YYYY').toUpperCase());
    setEndDate(moment(value[0].endDate).format('MMM DD, YYYY').toUpperCase());
    setStartTime(moment(value[0].startDate).format('HH:mm'));
    setEndTime(moment(value[0].endDate).format('HH:mm'));
  }, [value]);

  const onStartTimeBlur = (e) => {
    e.preventDefault();
    const parsed = moment(e.target.value, ['HHmm', 'HH:mm', 'Hmm', 'H:mm']);

    if (parsed.isValid()) {
      if (
        moment(value[0].startDate)
          .set({ hour: parsed.get('hour'), minute: parsed.get('minute') })
          .isAfter(moment(value[0].endDate))
      ) {
        // start > end: set end to one minute later
        setValue((prevValue) => [
          {
            ...prevValue[0],
            startDate: moment(prevValue[0].startDate)
              .set({ hour: parsed.get('hour'), minute: parsed.get('minute') })
              .toDate(),
            endDate: moment(prevValue[0].startDate)
              .set({ hour: parsed.get('hour'), minute: parsed.get('minute') })
              .add(1, 'm')
              .toDate(),
          },
        ]);
      } else {
        setValue((prevValue) => [
          {
            ...prevValue[0],
            startDate: moment(prevValue[0].startDate)
              .set({ hour: parsed.get('hour'), minute: parsed.get('minute') })
              .toDate(),
          },
        ]);
      }
    } else {
      setStartTime(moment(value[0].startDate).format('HH:mm'));
    }
  };

  const onEndTimeBlur = (e) => {
    e.preventDefault();
    const parsed = moment(e.target.value, ['HHmm', 'HH:mm', 'Hm', 'H:m']);
    if (parsed.isValid()) {
      if (
        moment(value[0].endDate)
          .set({ hour: parsed.get('hour'), minute: parsed.get('minute') })
          .isBefore(moment(value[0].startDate))
      ) {
        // end < start: set start to one minute before
        setValue((prevValue) => [
          {
            ...prevValue[0],
            endDate: moment(value[0].endDate)
              .set({ hour: parsed.get('hour'), minute: parsed.get('minute') })
              .toDate(),
            startDate: moment(value[0].endDate)
              .set({ hour: parsed.get('hour'), minute: parsed.get('minute') })
              .subtract(1, 'm')
              .toDate(),
          },
        ]);
      } else {
        setValue((prevValue) => [
          {
            ...prevValue[0],
            endDate: moment(value[0].endDate)
              .set({ hour: parsed.get('hour'), minute: parsed.get('minute') })
              .toDate(),
          },
        ]);
      }
    } else {
      setEndTime(moment(value[0].endDate).format('HH:mm'));
    }
  };

  const onStartDateBlur = (e) => {
    e.preventDefault();
    const parsed = moment(e.target.value, ['MMM D, YYYY', 'M D YYYY', 'M D YY', 'MMDDYYYY', 'MMDDYY']);
    if (parsed.isValid()) {
      if (
        moment(value[0].startDate)
          .set({ month: parsed.get('month'), date: parsed.get('date'), year: parsed.get('year') })
          .isAfter(moment(value[0].endDate))
      ) {
        // start > end: set end to one day later
        setValue((prevValue) => [
          {
            ...prevValue[0],
            startDate: moment(prevValue[0].startDate)
              .set({ month: parsed.get('month'), date: parsed.get('date'), year: parsed.get('year') })
              .toDate(),
            endDate: moment(prevValue[0].startDate)
              .set({ month: parsed.get('month'), date: parsed.get('date'), year: parsed.get('year') })
              .add(1, 'd')
              .toDate(),
          },
        ]);
      } else {
        setValue((prevValue) => [
          {
            ...prevValue[0],
            startDate: moment(prevValue[0].startDate)
              .set({ month: parsed.get('month'), date: parsed.get('date'), year: parsed.get('year') })
              .toDate(),
          },
        ]);
      }
    } else {
      setStartDate(moment(value[0].startDate).format('MMM DD, YYYY').toUpperCase());
    }
  };

  const onEndDateBlur = (e) => {
    e.preventDefault();
    const parsed = moment(e.target.value, ['MMM D, YYYY', 'M D YYYY', 'M D YY', 'MMDDYYYY', 'MMDDYY']);
    if (parsed.isValid()) {
      if (
        moment(value[0].endDate)
          .set({ month: parsed.get('month'), date: parsed.get('date'), year: parsed.get('year') })
          .isBefore(moment(value[0].startDate))
      ) {
        // end < start: set start to one day before
        setValue((prevValue) => [
          {
            ...prevValue[0],
            endDate: moment(value[0].endDate)
              .set({ month: parsed.get('month'), date: parsed.get('date'), year: parsed.get('year') })
              .toDate(),
            startDate: moment(value[0].endDate)
              .set({ month: parsed.get('month'), date: parsed.get('date'), year: parsed.get('year') })
              .subtract(1, 'd')
              .toDate(),
          },
        ]);
      } else {
        setValue((prevValue) => [
          {
            ...prevValue[0],
            endDate: moment(value[0].endDate)
              .set({ month: parsed.get('month'), date: parsed.get('date'), year: parsed.get('year') })
              .toDate(),
          },
        ]);
      }
    } else {
      setEndDate(moment(value[0].startDate).format('MMM DD, YYYY').toUpperCase());
    }
  };

  return (
    <>
      <div className={`${className} ${vertical ? classes.wrapperVertical : classes.wrapper}`}>
        <DateRange
          showDateDisplay={false}
          showMonthAndYearPickers={false}
          editableDateInputs
          onChange={(item) => setValue([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={value}
          color="#FFFFFF"
        />
        {/* <div className={vertical ? classes.fieldsWrapperVertical : classes.fieldsWrapper}> */}
        <FormControl className={vertical ? classes.fieldsWrapperVertical : classes.fieldsWrapper}>
          <div className={`${vertical ? classes.startDateFieldVertical : classes.startDateField}`}>
            <TextField
              className={classes.dateField}
              placeholder={dateFormatExamples[datePlaceHolder]}
              onFocus={(event) => event.target.select()}
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                notched: false,
              }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onBlur={(e) => onStartDateBlur(e)}
            />
            <TextField
              className={classes.timeField}
              placeholder={timeFormatExamples[timePlaceHolder]}
              onFocus={(event) => event.target.select()}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              onBlur={(e) => onStartTimeBlur(e)}
            />
          </div>
          <div className={`${vertical ? classes.endDateFieldVertical : classes.endDateField}`}>
            <TextField
              className={classes.dateField}
              placeholder={dateFormatExamples[datePlaceHolder]}
              onFocus={(event) => event.target.select()}
              label="End Date"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                notched: false,
              }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={(e) => onEndDateBlur(e)}
            />
            <TextField
              className={classes.timeField}
              placeholder={timeFormatExamples[timePlaceHolder]}
              onFocus={(event) => event.target.select()}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              onBlur={(e) => onEndTimeBlur(e)}
            />
          </div>
        </FormControl>
      </div>
    </>
  );
}
