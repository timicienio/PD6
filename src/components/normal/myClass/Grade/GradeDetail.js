import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchGrade } from '../../../../actions/myClass/grade';
import PageTitle from '../../../ui/PageTitle';

import GradeInfo from './detail/GradeInfo';
import Grader from './detail/Grader';
import GradeInfoEdit from './detail/GradeInfoEdit';
import GradeDelete from './detail/GradeDelete';
import NoMatch from '../../../noMatch';
import GeneralLoading from '../../../GeneralLoading';

/* This is a level 4 component (page component) */
export default function GradeDetail() {
  const dispatch = useDispatch();
  const { classId, gradeId } = useParams();

  const authToken = useSelector((state) => state.auth.token);
  const accounts = useSelector((state) => state.accounts);
  const grades = useSelector((state) => state.grades);
  const loading = useSelector((state) => state.loading.myClass.grade);
  const user = useSelector((state) => state.user);
  const [isManager, setIsManager] = useState(false);

  const [editGradeInfo, setEditGradeInfo] = useState(false);

  useEffect(() => {
    if (!loading.editGrade) {
      dispatch(fetchGrade(authToken, gradeId));
    }
  }, [dispatch, authToken, loading.editGrade, gradeId]);

  useEffect(() => {
    if (user.classes) {
      if (user.classes.filter((item) => item.class_id === Number(classId))[0].role === 'MANAGER') setIsManager(true);
    }
  }, [classId, user.classes]);

  const handleBack = () => {
    setEditGradeInfo(false);
  };

  const handleEdit = () => {
    setEditGradeInfo(true);
  };
  if (grades.byId[gradeId] === undefined) {
    if (loading.fetchGrade || loading.editGrade) {
      return <GeneralLoading />;
    }
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle text="Grade / Detail" />

      {editGradeInfo ? (
        <GradeInfoEdit
          receiver={accounts.byId[grades.byId[gradeId].receiver_id]}
          grade={grades.byId[gradeId]}
          handleBack={handleBack}
        />
      ) : (
        <GradeInfo
          isManager={isManager}
          receiver={accounts.byId[grades.byId[gradeId].receiver_id]}
          grade={grades.byId[gradeId]}
          handleEdit={handleEdit}
        />
      )}

      {grades.byId[gradeId].grader_id && <Grader grader={accounts.byId[grades.byId[gradeId].grader_id]} />}

      {isManager && (
        <GradeDelete
          username={accounts.byId[grades.byId[gradeId].receiver_id].username}
          title={grades.byId[gradeId].title}
        />
      )}
    </>
  );
}
