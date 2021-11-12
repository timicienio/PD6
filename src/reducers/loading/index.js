import { combineReducers } from 'redux';
import admin from './admin';
import myClass from './myClass';
import common from './common';
import user from './user';
import api from './api';

export default combineReducers({
  admin,
  common,
  user,
  myClass,
  api,
});
