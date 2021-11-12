import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { browseAccessLog } from '../../../actions/api/view';
import AutoTable from '../../ui/AutoTable';
import PageTitle from '../../ui/PageTitle';

/* This is a level 4 component (page component) */
export default function AccessLog() {
  const error = useSelector((state) => state.error.api.view.browseAccessLog);
  const accessLogs = useSelector((state) => state.accessLogs);
  const authToken = useSelector((state) => state.auth.token);
  const accounts = useSelector((state) => state.accounts);
  const dispatch = useDispatch();

  return (
    <>
      <PageTitle text="Access Log" />
      <AutoTable
        ident="SM Access Log Table"
        hasFilter
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
            reduxStateId: 'ip',
            label: 'IP',
            type: 'TEXT',
            operation: 'LIKE',
          },
          {
            reduxStateId: 'resource_path',
            label: 'Resource Path',
            type: 'TEXT',
            operation: 'LIKE',
          },
          {
            reduxStateId: 'request_method',
            label: 'Request Method',
            type: 'ENUM',
            operation: 'IN',
            options: [
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'PATCH', label: 'PATCH' },
              { value: 'DELETE', label: 'DELETE' },
            ],
          },
          // {
          //   reduxStateId: 'access_time',
          //   label: 'Access Time',
          //   type: 'DATE',
          //   operation: 'LIKE',
          // },
        ]}
        refetch={(browseParams, ident) => {
          dispatch(browseAccessLog(authToken, browseParams, ident));
        }}
        refetchErrors={[error]}
        columns={[
          {
            name: 'Username',
            align: 'center',
            type: 'link',
            sortable: 'username',
            width: 150,
          },
          {
            name: 'Student ID',
            align: 'center',
            type: 'string',
            sortable: 'student_id',
            width: 150,
          },
          {
            name: 'Real Name',
            align: 'center',
            type: 'string',
            sortable: 'real_name',
            width: 150,
          },
          {
            name: 'IP',
            align: 'center',
            type: 'string',
            sortable: 'ip',
            width: 150,
          },
          {
            name: 'Resource Path',
            align: 'center',
            type: 'string',
            sortable: 'resource_path',
            width: 150,
          },
          {
            name: 'Request Method',
            align: 'center',
            type: 'string',
            sortable: 'request_method',
            width: 180,
          },
          {
            name: 'Access Time',
            align: 'center',
            type: 'string',
            sortable: 'access_time',
            width: 150,
          },
        ]}
        reduxData={accessLogs}
        reduxDataToRows={(item) => ({
          id: item.id,
          Username: {
            text: accounts.byId[item.account_id]?.username ?? '',
            path: `/admin/account/account/${item.account_id}/setting`,
          },
          'Student ID': accounts.byId[item.account_id]?.student_id ?? '',
          'Real Name': accounts.byId[item.account_id]?.real_name ?? '',
          IP: item.ip,
          'Resource Path': item.resource_path,
          'Request Method': item.request_method,
          'Access Time': moment(item.access_time).format('YYYY-MM-DD, HH:mm:ss'),
        })}
      />
    </>
  );
}
