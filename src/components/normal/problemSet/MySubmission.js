import React from 'react';
import MySubmissionView from '../../ui/templates/MySubmissionView';

/* This is a level 4 component (page component) */
export default function MySubmission() {
  const baseUrl = '/problem-set';

  return <MySubmissionView baseUrl={baseUrl} isProblemSet />;
}
