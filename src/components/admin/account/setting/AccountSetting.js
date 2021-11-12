import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Snackbar } from '@material-ui/core';
import { fetchStudentCards, browsePendingStudentCards } from '../../../../actions/admin/account';
import { fetchAccount, getInstitutes } from '../../../../actions/common/common';
import PageTitle from '../../../ui/PageTitle';
import NoMatch from '../../../noMatch';
import BasicInfo from './BasicInfo';
import BasicInfoEdit from './BasicInfoEdit';
import StudentInfoEdit from './StudentInfoEdit';
import AccountDelete from './AccountDelete';
import NewPassword from './NewPassword';
import GeneralLoading from '../../../GeneralLoading';

/* This is a level 4 component (page component) */

export default function AccountSetting() {
  const [cards, setCards] = useState([]);
  const [pendingCards, setPendingCards] = useState([]);
  const [editBasicInfo, setEditBasicInfo] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const { accountId } = useParams();

  const authToken = useSelector((state) => state.auth.token);
  const accounts = useSelector((state) => state.accounts);
  const studentCards = useSelector((state) => state.studentCards);
  const pendingStudentCards = useSelector((state) => state.pendingStudentCards);
  const loading = useSelector((state) => state.loading.admin.account);

  useEffect(() => {
    if (!loading.editAccount) {
      dispatch(fetchAccount(authToken, accountId));
    }
  }, [accountId, authToken, dispatch, loading.editAccount]);

  useEffect(() => {
    if (!loading.makeStudentCardDefault) {
      dispatch(fetchStudentCards(authToken, accountId));
    }
  }, [accountId, authToken, dispatch, loading.makeStudentCardDefault]);

  useEffect(() => {
    if (!loading.deletePendingStudentCard && !loading.addStudentCard) {
      dispatch(browsePendingStudentCards(authToken, accountId));
    }
  }, [accountId, authToken, dispatch, loading.addStudentCard, loading.deletePendingStudentCard]);

  useEffect(() => {
    if (accounts.byId[accountId]) {
      setCards(
        accounts.byId[accountId].studentCardIds.reduce((acc, key) => {
          if (studentCards.byId[key]) {
            return [...acc, studentCards.byId[key]];
          }
          return [...acc];
        }, []),
      );
    }
  }, [accountId, accounts, loading.fetchStudentCards, studentCards]);

  useEffect(() => {
    if (accounts.byId[accountId]) {
      setPendingCards(
        accounts.byId[accountId].pendingStudentCardIds.reduce((acc, key) => {
          if (pendingStudentCards.byId[key]) {
            if (pendingStudentCards.byId[key].institute_id !== null) {
              return [...acc, pendingStudentCards.byId[key]];
            }
          }
          return [...acc];
        }, []),
      );
    }
  }, [accountId, accounts, pendingStudentCards]);

  useEffect(() => {
    dispatch(getInstitutes());
  }, [dispatch]);

  if (accounts.byId[accountId] === undefined || studentCards.byId === undefined) {
    if (loading.fetchAccount || loading.fetchStudentCards || loading.browsePendingStudentCards) {
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
    <div>
      <PageTitle text={`${accounts.byId[accountId].username} / Setting`} />
      {editBasicInfo ? (
        <BasicInfoEdit
          handleBack={handleBasicBack}
          realName={accounts.byId[accountId].real_name}
          userName={accounts.byId[accountId].username}
          nickName={accounts.byId[accountId].nickname}
          altMail={accounts.byId[accountId].alternative_email}
        />
      ) : (
        <BasicInfo
          handleEdit={handleBasicEdit}
          realName={accounts.byId[accountId].real_name}
          userName={accounts.byId[accountId].username}
          nickName={accounts.byId[accountId].nickname}
          altMail={accounts.byId[accountId].alternative_email}
        />
      )}

      <div>
        <StudentInfoEdit cards={cards} pendingCards={pendingCards} />
      </div>

      <NewPassword />
      <AccountDelete
        userName={accounts.byId[accountId].username}
        cards={cards}
        realName={accounts.byId[accountId].real_name}
      />
      <Snackbar open={showSnackbar} autoHideDuration={3000} message={message} onClose={() => setShowSnackbar(false)} />
    </div>
  );
}
