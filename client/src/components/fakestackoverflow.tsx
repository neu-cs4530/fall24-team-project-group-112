import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import Layout from './layout';
import Login from './login';
import Register from './register';
import Profile from './main/profile';
import { FakeSOSocket, User } from '../types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import useLocalStorage from '../hooks/useLocalStorage';
import NotificationCenter from './main/notificationPage';

const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: User | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  if (!user || !socket) {
    return <Navigate to='/' />;
  }

  return <UserContext.Provider value={{ user, socket }}>{children}</UserContext.Provider>;
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const { getItem } = useLocalStorage();

  // Initialize `user` directly from localStorage once during component mount
  const [user, setUser] = useState<User | null>(() => {
    const userItem = getItem('user');
    return userItem ? JSON.parse(userItem) : null;
  });
  const [notification, setNotification] = useState<boolean>(false);

  useEffect(() => {
    if (!socket) {
      return () => {};
    }
    const handleNotificationUpdate = async () => {
      setNotification(true);
    };

    socket.on('notificationUpdate', handleNotificationUpdate);

    return () => {
      socket.off('notificationUpdate', handleNotificationUpdate);
    };
  }, [socket]);

  return (
    <LoginContext.Provider value={{ setUser }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={notification}
        autoHideDuration={5000}
        onClose={() => setNotification(false)}
        message='You have a new notification!'
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
