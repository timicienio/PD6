import React from 'react';
import SubmissionDetailView from '../../ui/templates/SubmissionDetailView';

/* This is a level 4 component (page component) */
export default function SubmissionDetail() {
  const baseUrl = '/problem-set';

  return <SubmissionDetailView baseUrl={baseUrl} isManager={false} isProblemSet />;
}
