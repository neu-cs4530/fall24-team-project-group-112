import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Button, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { io } from 'socket.io-client';
import Layout from './layout';
import Login from './login';
import Register from './register';
import Profile from './main/profile';
import { FakeSOSocket, User, Notification } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import NotificationCenter from './main/activityPages/notificationPage';
import Feed from './main/activityPages/feedPage';
import useUser from '../hooks/useUser';

/**
 * Represents a protected route that checks if a user is logged in.
 * If the user is not logged in, they are redirected to the login page.
 * If the user is logged in, the user and socket are passed to the children components.
 */
const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: User | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  if (!user) {
    return <Navigate to='/' />;
  }

  if (!socket) {
    const serverURL = process.env.REACT_APP_SERVER_URL;
    if (serverURL === undefined) {
      return <Navigate to='/' />;
    }
    const newSocket = io(serverURL);
    return (
      <UserContext.Provider value={{ user, socket: newSocket }}>{children}</UserContext.Provider>
    );
  }

  return <UserContext.Provider value={{ user, socket }}>{children}</UserContext.Provider>;
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const [notificationAlert, setNotificationAlert] = useState<boolean>(false);
  const { user, setUser } = useUser();

  useEffect(() => {
    const handleNotificationUpdate = async (notification: Notification) => {
      if (notification.receiverUsername !== user?.username) return;
      setNotificationAlert(true);
    };

    socket?.on('notificationUpdate', handleNotificationUpdate);

    return () => {
      socket?.off('notificationUpdate', handleNotificationUpdate);
    };
  }, [socket, user?.username]);

  const snackbarAction = (
    <React.Fragment>
      <Link to='/notification'>
        <Button color='primary' size='small' onClick={() => setNotificationAlert(false)}>
          View
        </Button>
      </Link>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={() => setNotificationAlert(false)}>
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  );

  return (
    <LoginContext.Provider value={{ setUser }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={notificationAlert}
        autoHideDuration={5000}
        onClose={() => setNotificationAlert(false)}
        message='You have a new notification!'
        action={snackbarAction}
      />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={user ? <Navigate to='/home' /> : <Login />} />
        <Route path='/register' element={user ? <Navigate to='/home' /> : <Register />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute user={user} socket={socket}>
              <Layout user={user} />
            </ProtectedRoute>
          }>
          <Route path='/home' element={<QuestionPage />} />
          <Route path='/tags' element={<TagPage />} />
          <Route path='/notification' element={<NotificationCenter />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/question/:qid' element={<AnswerPage />} />
          <Route path='/new/question' element={<NewQuestionPage />} />
          <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
          <Route path='/profile/:username' element={<Profile loggedInUser={user} />} />
        </Route>
      </Routes>
    </LoginContext.Provider>
  );
};

export default FakeStackOverflow;
