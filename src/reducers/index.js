import { combineReducers } from 'redux';
import auth from './auth';
import institutes from './institutes';
import challenges from './challenges';
import grades from './grades';
import courses from './courses';
import classes from './classes';
import classMembers from './classMembers';
import problem from './problems';
import testcases from './testcases';
import assistingData from './assistingData';
import submissions from './submissions';
import judgments from './judgments';
import teamMembers from './teamMembers';
import teams from './teams';
import accounts from './accounts';
import studentCards from './studentCards';
import user from './user';
import accessLogs from './accessLogs';
import announcements from './announcements';
import submitLangs from './submitLangs';
import essays from './essays';
import peerReviews from './peerReviews';
import peerReviewRecords from './peerReviewRecords';
import peerReviewSummaryReview from './peerReviewSummaryReview';
import peerReviewSummaryReceive from './peerReviewSummaryReceive';
import judgeCases from './judgeCases';
import downloadLinks from './downloadLinks';
import loading from './loading/index';
import error from './error/index';
import component from './component';
import essaySubmission from './essaySubmission';
import pendingStudentCards from './pendingStudentCards';

export default combineReducers({
  auth,
  institutes,
  challenges,
  courses,
  classes,
  grades,
  classMembers,
  problem,
  testcases,
  assistingData,
  submissions,
  judgments,
  teamMembers,
  teams,
  accounts,
  studentCards,
  user,
  accessLogs,
  announcements,
  submitLangs,
  loading,
  error,
  essays,
  peerReviews,
  peerReviewRecords,
  peerReviewSummaryReview,
  peerReviewSummaryReceive,
  judgeCases,
  downloadLinks,
  essaySubmission,
  component,
  pendingStudentCards,
});
