import { combineReducers } from 'redux';
import view from './view';
import peerReview from './peerReview';

export default combineReducers({
  view,
  peerReview,
});
