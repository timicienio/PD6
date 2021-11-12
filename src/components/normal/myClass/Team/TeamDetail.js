import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { fetchTeam, fetchTeamMembers } from '../../../../actions/myClass/team';
import TeamInfo from './detail/TeamInfo';
import TeamInfoEdit from './detail/TeamInfoEdit';
import TeamMember from './detail/TeamMember';
import TeamMemberEdit from './detail/TeamMemberEdit';
import TeamDelete from './detail/TeamDelete';
import NoMatch from '../../../noMatch';
import systemRoleTransformation from '../../../../function/systemRoleTransformation';
import GeneralLoading from '../../../GeneralLoading';
import PageTitle from '../../../ui/PageTitle';

/* This is a level 4 component (page component) */
export default function TeamDetail() {
  const dispatch = useDispatch();
  const { classId, teamId } = useParams();

  const authToken = useSelector((state) => state.auth.token);
  const teams = useSelector((state) => state.teams.byId);
  const teamMembers = useSelector((state) => state.teamMembers.byId);
  const teamMemberIds = useSelector((state) => state.teamMembers.allIds);
  const loading = useSelector((state) => state.loading.myClass.team);
  const error = useSelector((state) => state.error);
  const [addMemberFail, setAddMemberFail] = useState(false);

  const user = useSelector((state) => state.user);
  const [isManager, setIsManager] = useState(false);
  const [isTeamManager, setIsTeamManager] = useState(false);

  const [editTeamInfo, setEditTeamInfo] = useState(false);
  const [editTeamMember, setEditTeamMember] = useState(false);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    user.classes.forEach((item) => {
      if (item.class_id === parseInt(classId, 10)) {
        if (item.role === 'MANAGER') {
          setIsManager(true);
        } else if (
          teamMembers[user.id] !== undefined
          && item.role === 'NORMAL'
          && teamMembers[user.id].role === 'MANAGER'
        ) {
          setIsTeamManager(true);
        }
      }
    });
  }, [classId, teamMembers, user.classes, user.id]);

  useEffect(() => {
    if (!loading.editTeam) {
      dispatch(fetchTeam(authToken, teamId));
    }
  }, [authToken, dispatch, loading.editTeam, teamId]);

  useEffect(() => {
    if (!loading.addTeamMember && !loading.editTeamMember && !loading.deleteTeamMember) {
      dispatch(fetchTeamMembers(authToken, teamId));
    }
  }, [authToken, dispatch, teamId, loading.addTeamMember, loading.deleteTeamMember, loading.editTeamMember]);

  useEffect(() => {
    setTableData(
      teamMemberIds.map((id) => ({
        id: teamMembers[id] ? teamMembers[id].member_id : '',
        username: teamMembers[id] ? teamMembers[id].account.username : '',
        student_id: teamMembers[id] ? teamMembers[id].account.student_id : '',
        real_name: teamMembers[id] ? teamMembers[id].account.real_name : '',
        role: systemRoleTransformation(teamMembers[id].role),
        path: `/user-profile/${teamMembers[id].member_id}`,
      })),
    );
  }, [teamMemberIds, teamMembers]);

  const handleInfoBack = () => {
    setEditTeamInfo(false);
  };

  const handleInfoEdit = () => {
    setEditTeamInfo(true);
  };

  const handleMemberBack = () => {
    setEditTeamMember(false);
  };

  const handleMemberEdit = () => {
    setEditTeamMember(true);
  };

  const handleCloseError = () => {
    setAddMemberFail(false);
    error.myClass.team.addTeamMember = null;
    error.common.common.getAccountBatchByReferral = null;
  };

  if (loading.fetchTeam || loading.fetchTeamMember) {
    return <GeneralLoading />;
  }
  if (teams[teamId] === undefined || teamMemberIds === undefined) {
    return <NoMatch />;
  }

  return (
    <>
      <PageTitle text={`${teams[teamId].name} / Detail`} />
      {editTeamInfo ? (
        <TeamInfoEdit
          isManager={isManager}
          teamName={teams[teamId].name}
          label={teams[teamId].label}
          handleBack={handleInfoBack}
        />
      ) : (
        <TeamInfo
          isManager={!(!isManager && !isTeamManager)}
          teamName={teams[teamId].name}
          label={teams[teamId].label}
          handleEdit={handleInfoEdit}
        />
      )}

      {editTeamMember ? (
        <TeamMemberEdit
          isManager={isManager}
          setOriginData={setTableData}
          handleBack={handleMemberBack}
          setAddMemberFail={setAddMemberFail}
        />
      ) : (
        <TeamMember isManager={isManager} tableData={tableData} handleEdit={handleMemberEdit} />
      )}

      {isManager && <TeamDelete teamName={teams[teamId].name} label={teams[teamId].label} />}

      <Snackbar
        open={addMemberFail}
        onClose={handleCloseError}
        message={`Error: ${
          error.common.common.getAccountBatchByReferral !== 'null'
            ? error.common.common.getAccountBatchByReferral
            : error.myClass.team.addTeamMember
        }`}
      />
    </>
  );
}
