import React from 'react';
import { Button } from '@material-ui/core';
import StudentInfoCard from './StudentInfoCard';
import SimpleBar from '../../../ui/SimpleBar';

export default function StudentInfo(props) {
  const defaultCard = props.cards.filter((p) => p.is_default);
  const unDefaultCard = props.cards.filter((p) => !p.is_default);
  return (
    <div>
      <SimpleBar
        title="Student Information"
        buttons={(
          <>
            <Button onClick={() => props.handleEdit()}>Edit</Button>
          </>
        )}
      >
        {props.cards && (
          <div>
            {defaultCard.map((p) => (
              <StudentInfoCard
                key={p.id}
                isDefault={p.is_default}
                studentId={p.student_id}
                email={p.email}
                instituteId={p.institute_id}
              />
            ))}
            <p> </p>
            {unDefaultCard.map((p) => (
              <StudentInfoCard
                key={p.id}
                isDefault={p.is_default}
                studentId={p.student_id}
                email={p.email}
                instituteId={p.institute_id}
              />
            ))}
          </div>
        )}
      </SimpleBar>
    </div>
  );
}
