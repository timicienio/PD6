import React from 'react';
import { Button } from '@material-ui/core';
import SimpleBar from '../../../../ui/SimpleBar';
import SimpleTable from '../../../../ui/SimpleTable';

export default function TeamMember(props) {
  return (
    <div>
      <SimpleBar
        title="Team Member"
        buttons={props.isManager && <Button onClick={() => props.handleEdit()}>Edit</Button>}
        noIndent
      >
        <SimpleTable
          data={props.tableData}
          columns={[
            {
              id: 'username',
              label: 'Username',
              minWidth: 50,
              align: 'center',
              width: 200,
              type: 'link',
              link_id: 'path',
            },
            {
              id: 'student_id',
              label: 'Student ID',
              minWidth: 50,
              align: 'center',
              width: 150,
              type: 'string',
            },
            {
              id: 'real_name',
              label: 'Real Name',
              minWidth: 50,
              align: 'center',
              width: 150,
              type: 'string',
            },
            {
              id: 'role',
              label: 'Role',
              minWidth: 50,
              align: 'center',
              width: 150,
              type: 'string',
            },
          ]}
        />
      </SimpleBar>
    </div>
  );
}
