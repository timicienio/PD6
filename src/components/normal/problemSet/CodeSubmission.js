import React from 'react';
import CodeSubmissionView from '../../ui/templates/CodeSubmissionView';

/* This is a level 4 component (page component) */
export default function CodeSubmission() {
  const baseUrl = '/problem-set';

  return <CodeSubmissionView baseUrl={baseUrl} isProblemSet />;
}
