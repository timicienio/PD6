import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DialogContent,
  MenuItem,
  Select,
  Snackbar,
  Dialog,
  FormControl,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import { fetchStudentCards, browsePendingStudentCards } from '../../actions/user/user';
import { getInstitutes } from '../../actions/common/common';
import ThemeToggleContext from '../../contexts/themeToggleContext';
import GeneralLoading from '../GeneralLoading';
import PageTitle from '../ui/PageTitle';
import NoMatch from '../noMatch';
import BasicInfo from './BasicInfo';
import BasicInfoEdit from './BasicInfoEdit';
import StudentInfoEdit from './StudentInfoEdit';
import NewPassword from './NewPassword';
import useEventListener from '../../hooks/useEventListener';

const activeThemeList = [
  {
    label: 'PDOGS 6',
    value: 'pd6New',
  },
  {
    label: 'PDOGS 6 Classic',
    value: 'pd6',
  },
  {
    label: 'DOGE',
    value: 'doge',
  },
  {
    label: 'IM Night 2021',
    value: 'IMNight2021',
  },
  {
    label: 'IM Camp 2021',
    value: 'IMCamp2021',
  },
];

/* This is a level 3 component (page component) */

export default function AccountSetting() {
  const { value: selectedTheme, setter: setSelectedTheme } = useContext(ThemeToggleContext);
  const [cards, setCards] = useState([]);
  const [pendingCards, setPendingCards] = useState([]);
  const [editBasicInfo, setEditBasicInfo] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const accountId = useSelector((state) => state.user.id);
  const authToken = useSelector((state) => state.user.token);
  const account = useSelector((state) => state.user);
  const studentCards = useSelector((state) => state.studentCards);
  const pendingStudentCards = useSelector((state) => state.pendingStudentCards);
  const loading = useSelector((state) => state.loading.user);

  useEffect(() => {
    if (account.role === 'GUEST') {
      setMessage('Please verify your institute email to activate your PDOGS account.');
      setShowSnackbar(true);
    } else {
      setShowSnackbar(false);
    }
  }, [account.role]);

  useEffect(() => {
    if (!loading.user.makeStudentCardDefault) {
      dispatch(fetchStudentCards(authToken, accountId));
    }
  }, [authToken, accountId, dispatch, loading.user.makeStudentCardDefault]);

  useEffect(() => {
    if (!loading.user.deletePendingStudentCard && !loading.user.addStudentCard) {
      dispatch(browsePendingStudentCards(authToken, accountId));
    }
  }, [accountId, authToken, dispatch, loading.user.addStudentCard, loading.user.deletePendingStudentCard]);

  useEffect(() => {
    dispatch(getInstitutes());
  }, [dispatch]);

  useEffect(() => {
    setCards(
      account.studentCards.reduce((acc, key) => {
        if (studentCards.byId[key]) {
          return [...acc, studentCards.byId[key]];
        }
        return [...acc];
      }, []),
    );
  }, [account, studentCards]);

  useEffect(() => {
    setPendingCards(
      account.pendingStudentCards.reduce((acc, key) => {
        if (pendingStudentCards.byId[key]) {
          if (pendingStudentCards.byId[key].institute_id !== null) {
            return [...acc, pendingStudentCards.byId[key]];
          }
        }
        return [...acc];
      }, []),
    );
  }, [account, pendingStudentCards]);

  function keydownHandler({ key }) {
    if (String(key) === '/') {
      setShowThemeSelector((state) => !state);
    }
  }

  useEventListener('keydown', keydownHandler);

  if (account === undefined || studentCards === undefined) {
    if (loading.auth.fetchAccount || loading.user.fetchStudentCards || loading.user.browsePendingStudentCards) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  const handleBasicBack = (msg) => {
    setEditBasicInfo(false);
    if (msg !== '') {
      setMessage(msg);
      setShowSnackbar(true);
    }
  };

  const handleBasicEdit = () => {
    setEditBasicInfo(true);
  };

  return (
    <>
      <PageTitle text={`${account.username} / Setting`} />
      {editBasicInfo ? (
        <BasicInfoEdit
          handleBack={handleBasicBack}
          realName={account.real_name}
          userName={account.username}
          nickName={account.nickname}
          altMail={account.alternative_email}
        />
      ) : (
        <BasicInfo
          handleEdit={handleBasicEdit}
          realName={account.real_name}
          userName={account.username}
          nickName={account.nickname}
          altMail={account.alternative_email}
        />
      )}
      <div>
        <StudentInfoEdit cards={cards} pendingCards={pendingCards} />
      </div>
      <NewPassword />
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => {
          setShowSnackbar(false);
          setMessage('');
        }}
        message={message}
      />
      <Dialog open={showThemeSelector} onClose={() => setShowThemeSelector(false)}>
        <DialogTitle>
          <Typography variant="h4">Wow, super secret option! 🐕</Typography>
        </DialogTitle>
        <DialogContent>
          <FormControl variant="outlined">
            <Select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
              {activeThemeList.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
      </Dialog>
    </>
  );
}
