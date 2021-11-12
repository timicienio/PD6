import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { browseClassMember } from '../../../actions/api/view';
import AutoTable from '../../ui/AutoTable';
import PageTitle from '../../ui/PageTitle';
import MemberEdit from './MemberEdit';
import NoMatch from '../../noMatch';
import systemRoleTransformation from '../../../function/systemRoleTransformation';
import { getInstitutes } from '../../../actions/common/common';

/* This is a level 4 component (page component) */
export default function MemberList() {
  const { courseId, classId } = useParams();

  const dispatch = useDispatch();

  const authToken = useSelector((state) => state.auth.token);
  const accounts = useSelector((state) => state.accounts);
  const courses = useSelector((state) => state.courses);
  const classes = useSelector((state) => state.classes);
  const members = useSelector((state) => state.classMembers);
  const institutes = useSelector((state) => state.institutes);
  const loading = useSelector((state) => state.loading.admin.course);
  const error = useSelector((state) => state.error.common.common.fetchClassMembers);

  const [edit, setEdit] = useState(false);

  useEffect(() => {
    dispatch(getInstitutes());
  }, [authToken, dispatch]);

  if (courses.byId[courseId] === undefined || classes.byId[classId] === undefined) {
    if (loading.fetchCourses || loading.fetchClasses) {
      // still loading
      return <div>loading</div>;
    }
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle text={`${courses.byId[courseId].name} / ${classes.byId[classId].name} / Member`} />
      {edit ? (
        <MemberEdit
          dispatch={dispatch}
          authToken={authToken}
          classes={classes}
          classId={classId}
          backToMemberList={() => setEdit(false)}
          loading={loading}
        />
      ) : (
        <>
          <AutoTable
            ident={`SM Member Table ${classId}`}
            hasFilter
            buttons={(
              <>
                <Button onClick={() => setEdit(true)}>Edit</Button>
              </>
            )}
            filterConfig={[
              {
                reduxStateId: 'username',
                label: 'Username',
                type: 'TEXT',
                operation: 'LIKE',
              },
              {
                reduxStateId: 'student_id',
                label: 'Student ID',
                type: 'TEXT',
                operation: 'LIKE',
              },
              {
                reduxStateId: 'real_name',
                label: 'Real Name',
                type: 'TEXT',
                operation: 'LIKE',
              },
              {
                reduxStateId: 'abbreviated_name',
                label: 'Institute',
                type: 'ENUM',
                operation: 'IN',
                options: institutes.allIds.map((id) => {
                  const item = institutes.byId[id];
                  return {
                    value: item.abbreviated_name,
                    label: item.abbreviated_name,
                  };
                }),
              },
              {
                reduxStateId: 'role',
                label: 'Role',
                type: 'ENUM',
                operation: 'IN',
                options: [
                  { value: 'GUEST', label: 'Guest' },
                  { value: 'NORMAL', label: 'Normal' },
                  { value: 'MANAGER', label: 'Manager' },
                ],
              },
            ]}
            refetch={(browseParams, ident) => {
              dispatch(browseClassMember(authToken, classId, browseParams, ident));
            }}
            refetchErrors={[error]}
            columns={[
              {
                name: 'Username',
                width: 200,
                align: 'center',
                type: 'link',
              },
              {
                name: 'Student ID',
                width: 155,
                align: 'center',
                type: 'string',
              },
              {
                name: 'Real Name',
                width: 155,
                align: 'center',
                type: 'string',
              },
              {
                name: 'Institute',
                width: 165,
                align: 'center',
                type: 'string',
              },
              {
                name: 'Role',
                width: 127,
                align: 'center',
                type: 'string',
              },
            ]}
            reduxData={members}
            reduxDataToRows={(item) => ({
              id: item.id,
              Username: {
                text: accounts.byId[item.account_id].username,
                path: `/admin/account/account/${item.account_id}/setting`,
              },
              'Student ID': accounts.byId[item.account_id].student_id,
              'Real Name': accounts.byId[item.account_id].real_name,
              Institute: item.institute_abbreviated_name,
              Role: systemRoleTransformation(item.role),
            })}
          />
        </>
      )}
    </>
  );
}
