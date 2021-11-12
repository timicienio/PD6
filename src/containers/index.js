import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Switch, Route, useHistory, useLocation,
} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { makeStyles, Fab } from '@material-ui/core';
import { Feedback } from '@material-ui/icons';
import Normal from './normal';
import Admin from './admin';
import Account from './account';
import User from './user';
import MySubmission from './mySubmission';
import Sidebar from '../components/ui/Sidebar';
import Header from '../components/ui/Header';
import { getUserInfo } from '../actions/user/auth';
import Icon from '../components/ui/icon';
import '../styles/index.css';

const useStyles = makeStyles(() => ({
  bugReport: {
    position: 'fixed',
    right: '3.5vw',
    top: 'calc(95vh - 55px)',
  },
}));

function Index() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [cookies, , removeCookie] = useCookies(['id', 'token']);

  const [showSidebar, setShowSidebar] = useState(true);
  const [disableSidebar, setDisableSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar((state) => !state);
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      if (cookies.id && cookies.token) {
        if (auth.tokenExpired) {
          removeCookie('token', { path: '/' });
          removeCookie('id', { path: '/' });
          history.push('/login');
        } else {
          dispatch(getUserInfo(cookies.id, cookies.token));
        }
      } else {
        history.push('/login');
      }
    }
  }, [auth.isAuthenticated, auth.tokenExpired, cookies, cookies.id, cookies.token, dispatch, history, removeCookie]);

  useEffect(() => {
    if (auth.isAuthenticated && location.pathname === '/') {
      if (user.role.indexOf('MANAGER') !== -1 || user.role === 'MANAGER') {
        history.push('/admin/course/course');
      } else if (user.role.indexOf('NORMAL') !== -1 || user.role === 'NORMAL') {
        if (user.classes.length !== 0) {
          const sortedClasses = user.classes.sort(
            (a, b) => b.class_name.localeCompare(a.class_name) || b.course_name.localeCompare(a.course_name),
          );
          history.push(`/my-class/${sortedClasses[0].course_id}/${sortedClasses[0].class_id}/challenge`);
        } else {
          history.push('/all-class');
        }
      } else {
        history.push('/my-profile');
      }
    }
  }, [auth.isAuthenticated, history, location.pathname, user.classes, user.classes.length, user.role]);

  // configure the path names in which sidebars are disabled
  useEffect(() => {
    const disableSidebarPaths = ['/my-submission'];
    if (disableSidebarPaths.reduce((acc, item) => acc || item === location.pathname, false)) {
      setDisableSidebar(true);
    } else {
      setDisableSidebar(false);
    }
  }, [location.pathname]);

  if (!auth.isAuthenticated) {
    return <></>;
  }

  return (
    <>
      <div className="wrapper">
        <Header />
        <Sidebar open={showSidebar && !disableSidebar} onClose={() => setShowSidebar(false)} />
        <div>
          <div
            className={`layout-content-container${
              showSidebar && !disableSidebar ? '' : ' layout-content-container-no-sidebar'
            }`}
          >
            <div className={disableSidebar ? 'hide' : 'sidebar-toggle-pin'}>
              <Icon.VerticalLine className="sidebar-line" onClick={toggleSidebar} />
            </div>
            <div className="layout-content">
              <Switch>
                <Route path="/admin" component={Admin} />
                <Route path="/my-profile" component={Account} />
                <Route path="/my-submission" component={MySubmission} />
                <Route exact path="/user-profile/:accountId" component={User} />
                <Route path="/" component={Normal} />
              </Switch>
            </div>
          </div>
        </div>
        <Fab href="https://forms.gle/KaYJnXwgvsovzqVG7" target="_blank" className={classes.bugReport}>
          <Feedback />
        </Fab>
      </div>
    </>
  );
}

export default Index;
