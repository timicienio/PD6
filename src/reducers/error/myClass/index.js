import { combineReducers } from 'redux';
import grade from './grade';
import challenge from './challenge';
import member from './member';
import problem from './problem';
import submissions from './submissions';
import team from './team';
import judgements from './judgements';
import essaySubmission from './essaySubmission';
import peerReview from './peerReview';

export default combineReducers({
  grade,
  challenge,
  member,
  problem,
  submissions,
  team,
  judgements,
  essaySubmission,
  peerReview,
});
