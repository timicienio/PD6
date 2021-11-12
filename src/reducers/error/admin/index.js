import { combineReducers } from 'redux';
import course from './course';
import account from './account';
import system from './system';

export default combineReducers({ course, account, system });
