import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import SimpleBar from '../../../../ui/SimpleBar';
import SimpleTable from '../../../../ui/SimpleTable';
import { readProblemInfo } from '../../../../../actions/myClass/problem';

const scoreboardBasicTitle = [
  {
    id: 'rank',
    label: 'Rank',
    align: 'center',
    width: 100,
    type: 'string',
  },
  {
    id: 'team_name',
    label: 'Team Name',
    minWidth: 100,
    align: 'center',
    width: 200,
    type: 'link',
    link_id: 'team_path',
  },
  {
    id: 'total_score',
    label: 'Total Score',
    minWidth: 100,
    align: 'center',
    width: 200,
    type: 'string',
  },
];

// TODO: replace with view api to get real data
const mockteam1 = {
  team_id: 4,
  team_name: 'test_modify_name',
  total_score: 40.33,
  target_problem_data: [
    { problem_id: 1, score: 40.1, submission_id: 571 },
    { problem_id: 2, score: 40.2, submission_id: 567 },
  ],
};
const mockteam2 = {
  team_id: 78,
  team_name: 'Team Apple',
  total_score: 70.33,
  target_problem_data: [
    { problem_id: 1, score: 30.1, submission_id: 571 },
    { problem_id: 2, score: 40.2, submission_id: 567 },
  ],
};
const mockteam3 = {
  team_id: 9,
  team_name: 'edit team',
  total_score: 66.33,
  target_problem_data: [
    { problem_id: 1, score: 33.1, submission_id: 571 },
    { problem_id: 2, score: 33.2, submission_id: 567 },
  ],
};

export default function ScoreboardInfo() {
  const { courseId, classId } = useParams();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);
  const problems = useSelector((state) => state.problem.byId);
  const [scoreboardTitle, setScoreboardTitle] = useState(scoreboardBasicTitle);
  const [teams, setTeams] = useState([]);
  const [hasReadProblem, setHasReadProblem] = useState(false);

  useEffect(() => {
    if (teams.length > 0 && !hasReadProblem) {
      teams[0].target_problem_data.map((p) => dispatch(readProblemInfo(authToken, p.problem_id)));
      setHasReadProblem(true);
    }
  }, [authToken, dispatch, hasReadProblem, teams]);

  useEffect(() => {
    // TODO: set tempTeams with view api.
    let tempTeams = [mockteam1, mockteam2, mockteam3];
    tempTeams.sort((a, b) => b.total_score - a.total_score);

    if (tempTeams.length > 0) {
      const scoreColumns = tempTeams[0].target_problem_data.map((p) => {
        const column = {
          id: `problem-${p.problem_id}-score`,
          label: `${problems[p.problem_id]?.challenge_label} Score`,
          minWidth: 100,
          align: 'center',
          width: 200,
          type: 'string',
        };
        if (p.submission_id) {
          column.type = 'link';
          column.link_id = `problem-${p.problem_id}-submission`;
        }
        return column;
      });
      setScoreboardTitle([].concat(scoreboardBasicTitle, scoreColumns));
    }

    tempTeams = tempTeams.map((team, index) => {
      const tempTeam = {
        ...team,
        rank: index + 1,
        team_path: `/my-class/${courseId}/${classId}/team/${team.team_id}`,
      };
      for (let i = 0; i < tempTeam.target_problem_data.length; i += 1) {
        const p = tempTeam.target_problem_data[i];
        tempTeam[`problem-${p.problem_id}-score`] = p.score;
        if (p.submission_id) {
          tempTeam[
            `problem-${p.problem_id}-submission`
          ] = `/my-class/${courseId}/${classId}/submission/${p.submission_id}`;
        }
      }
      return tempTeam;
    });
    setTeams(tempTeams);
  }, [classId, courseId, problems]);

  return (
    <>
      <Typography variant="h3">Midterm / Scoreboard</Typography>
      <SimpleBar title="Scoreboard" noIndent>
        <SimpleTable isEdit={false} hasDelete={false} columns={scoreboardTitle} data={teams} />
      </SimpleBar>
    </>
  );
}
