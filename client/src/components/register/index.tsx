import React from 'react';
import { NavLink } from 'react-router-dom';
import './index.css';
import useLogin from '../../hooks/useLogin';

/**
 * Register Component contains a form that allows the user to create a new account, which is then submitted
 * to the application's context creating a new account using the useRegisterContext hook.
 */
const Register = () => {
  const { username, handleSubmit, handleInputChange } = useLogin();
  // create a new hook

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>Register a new account</h4>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={username}
          onChange={handleInputChange}
          placeholder='Enter your username'
          required
          className='input-text'
          id={'usernameInput'}
        />
        <button type='submit' className='login-button'>
          Submit
        </button>
      </form>
      <div>
        Already have an account? &nbsp;
        <NavLink to='/'>Click here to login.</NavLink>
      </div>
    </div>
  );
};

export default Register;
