import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button,
  Typography,
  Card,
  CardContent,
  makeStyles,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Snackbar,
  CircularProgress,
} from '@material-ui/core';
import { addStudentCard } from '../../../../actions/admin/account';
import StudentInfoCard from './StudentInfoCard';
import SimpleBar from '../../../ui/SimpleBar';
import AlignedText from '../../../ui/AlignedText';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    width: '600px',
    display: 'flex',
    justifyContent: 'center',
  },
  selectList: {
    width: '350px',
  },
  mailfield: {
    width: '200px',
    marginRight: '10px',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  mailrow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  item: {
    width: '190px',
  },
  addBlock: {
    marginTop: '16px',
    marginBottom: '16px',
    width: '600px',
  },
  addCard: {
    width: '600px',
    height: '329px',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    '&:last-child': {
      padding: '20px 0px 20px 30px',
    },
  },
  buttons: {
    alignSelf: 'flex-end',
    marginTop: '7px',
    marginRight: '23px',
  },
}));

export default function StudentInfoEdit(props) {
  const classes = useStyles();
  const [cards, setCards] = useState(props.cards);
  const [pendingCards, setPendingCards] = useState(props.pendingCards);
  const [add, setAdd] = useState(false); // addCard block
  const [mailSnackBar, setMailSnackBar] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [emailTail, setEmailTail] = useState('@ntu.edu.tw');
  const [addInputs, setAddInputs] = useState({
    institute: 'National Taiwan University',
    studentId: '',
    email: '',
  });
  const [errors, setErrors] = useState({
    studentId: false,
    email: false,
  });
  const [errorTexts, setErrorTexts] = useState({
    studentId: '',
    email: '',
  });

  const institutes = useSelector((state) => state.institutes.byId);
  const institutesId = useSelector((state) => state.institutes.allIds);
  const enableInstitutesId = institutesId.filter((item) => !institutes[item].is_disabled);
  const loading = useSelector((state) => state.loading);
  const error = useSelector((state) => state.error.admin.account);

  const { accountId } = useParams();
  const authToken = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.cards) {
      setCards(props.cards);
    }
  }, [props.cards]);

  useEffect(() => {
    if (props.pendingCards) {
      setPendingCards(props.pendingCards);
    }
  }, [props.pendingCards]);

  const handleAddCancel = () => {
    setAdd(false);
    setAddInputs({ institute: 'National Taiwan University', studentId: '', email: '' });
    setEmailTail('@ntu.edu.tw');
    setErrors({ studentId: false, email: false });
    setErrorTexts({ studentId: '', email: '' });
  };

  const addStudentCardSuccess = () => {
    setMailSnackBar(true);
  };

  const handleAddSave = () => {
    if (addInputs.studentId === '' || addInputs.email === '') {
      if (addInputs.studentId === '') {
        setErrors((ori) => ({ ...ori, studentId: true }));
        setErrorTexts((ori) => ({ ...ori, studentId: "Can't be empty" }));
      }
      if (addInputs.email === '') {
        setErrors((ori) => ({ ...ori, email: true }));
        setErrorTexts((ori) => ({ ...ori, email: "Can't be empty" }));
      }
      return;
    }
    const inputInstituteId = institutesId.filter((id) => institutes[id].full_name === addInputs.institute);
    if (inputInstituteId.length !== 0) {
      dispatch(
        addStudentCard(
          authToken,
          accountId,
          inputInstituteId[0],
          addInputs.email,
          addInputs.studentId,
          addStudentCardSuccess,
          () => setShowSnackBar(true),
        ),
      );
    }
    setAdd(false);
    setAddInputs({ institute: 'National Taiwan University', studentId: '', email: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddInputs((input) => ({ ...input, [name]: value }));

    if (name === 'institute') {
      const inputInstituteId = institutesId.filter((id) => institutes[id].full_name === value);
      if (inputInstituteId.length !== 0) {
        setEmailTail(`@${institutes[inputInstituteId[0]].email_domain}`);
      } else {
        setEmailTail('@ntu.edu.tw');
      }
    }
    if (name === 'studentId' && value !== '') {
      setErrors((ori) => ({ ...ori, studentId: false }));
      setErrorTexts((ori) => ({ ...ori, studentId: '' }));
    }
    if (name === 'email' && value !== '') {
      setErrors((ori) => ({ ...ori, email: false }));
      setErrorTexts((ori) => ({ ...ori, email: '' }));
    }
  };

  return (
    <div>
      <SimpleBar title="Student Information">
        {cards && (
          <div>
            {cards.map((p) => {
              if (p.is_default === true) {
                return (
                  <div key={p.id}>
                    <StudentInfoCard
                      key={p.id}
                      isDefault={p.is_default}
                      studentId={p.student_id}
                      email={p.email}
                      instituteId={p.institute_id}
                    />
                    <p />
                  </div>
                );
              }
              return <div key={p.id} />;
            })}
            <p />
            {cards.map((p) => {
              if (p.is_default === false) {
                return (
                  <div key={p.id}>
                    <StudentInfoCard
                      key={p.id}
                      id={p.id}
                      isDefault={p.is_default}
                      studentId={p.student_id}
                      email={p.email}
                      instituteId={p.institute_id}
                    />
                    <p />
                  </div>
                );
              }
              return <div key={p.id} />;
            })}
          </div>
        )}
        <p />
        {pendingCards && (
          <div>
            {pendingCards.map((p) => (
              <div key={p.id}>
                <StudentInfoCard
                  key={p.id}
                  pending
                  id={p.id}
                  email={p.email}
                  studentId={p.student_id}
                  instituteId={p.institute_id}
                />
                <p />
              </div>
            ))}
          </div>
        )}
        {add && (
          <div className={classes.addBlock}>
            <Card variant="outlined">
              <CardContent className={classes.addCard}>
                <div className={classes.row}>
                  <div className={classes.item}>
                    <Typography>Institute</Typography>
                  </div>
                  <FormControl variant="outlined" className={classes.selectList}>
                    <Select value={addInputs.institute} name="institute" onChange={(e) => handleChange(e)}>
                      {enableInstitutesId.map((item) => (
                        <MenuItem key={item} value={institutes[item].full_name}>
                          {institutes[item].full_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <AlignedText text="Student ID" childrenType="field">
                  <TextField
                    variant="outlined"
                    name="studentId"
                    value={addInputs.studentId}
                    onChange={(e) => handleChange(e)}
                    error={errors.studentId}
                    helperText={errorTexts.studentId}
                  />
                </AlignedText>
                <div className={classes.mailrow}>
                  <div className={classes.item}>
                    <Typography>Email</Typography>
                  </div>
                  <TextField
                    variant="outlined"
                    name="email"
                    className={classes.mailfield}
                    value={addInputs.email}
                    onChange={(e) => handleChange(e)}
                    error={errors.email}
                    helperText={errorTexts.email}
                  />
                  <Typography>{emailTail}</Typography>
                </div>
                <div className={classes.buttons}>
                  <Button onClick={handleAddCancel}>Cancel</Button>
                  <Button color="primary" onClick={handleAddSave}>
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {!add && !pendingCards.length && !loading.admin.account.addStudentCard && (
          <div className={classes.buttonContainer}>
            <div className={classes.addButton}>
              <Button
                onClick={() => {
                  setAdd(true);
                }}
              >
                +
              </Button>
            </div>
          </div>
        )}
        {loading.admin.account.addStudentCard && (
          <div className={classes.buttonContainer}>
            <div className={classes.addButton}>
              <CircularProgress />
            </div>
          </div>
        )}
        <Snackbar
          open={mailSnackBar}
          autoHideDuration={3000}
          message="Verification email sent! Please check your mailbox."
          onClose={() => setMailSnackBar(false)}
        />
        <Snackbar
          open={showSnackBar}
          autoHideDuration={3000}
          message={`Error: ${error.addStudentCard}`}
          onClose={() => setShowSnackBar(false)}
        />
      </SimpleBar>
    </div>
  );
}
