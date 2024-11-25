import React from 'react';
import { NavLink } from 'react-router-dom';
import './index.css';
import useRegister from '../../hooks/useRegister';

/**
 * Register Component contains a form that allows the user to create a new account, which is then submitted
 * to the application's context creating a new account using the useRegisterContext hook.
 */
const Register = () => {
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    textErr,
    handleFirstNameChange,
    handleLastNameChange,
    handleEmailChange,
    handleUsernameChange,
    handlePasswordChange,
    handleSubmit,
  } = useRegister();
  // create a new hook

  return (
    <div className='container'>
      <h2 className='font-bold text-2xl'>Welcome to Stack Overgram!</h2>
      <h4>Register a new account</h4>
      {textErr !== '' && (
        <div className='account-creation-error'>
          {textErr === 'Username already exists, choose a unique username'
            ? 'This username is taken, please choose a different one'
            : 'Error in creating your account, please try again or use a different username'}
        </div>
      )}
      <form onSubmit={handleSubmit} className='form-container'>
        <input
          type='text'
          value={firstName}
          onChange={handleFirstNameChange}
          placeholder='Enter your first name'
          required
          className='input-text'
          id={'firstNameInput'}
        />
        <input
          type='text'
          value={lastName}
          onChange={handleLastNameChange}
          placeholder='Enter your last name'
          required
          className='input-text'
          id={'lastNameInput'}
        />
        <input
          type='text'
          value={email}
          onChange={handleEmailChange}
          placeholder='Enter your email'
          required
          className='input-text'
          id={'emailInput'}
        />
        <input
          type='text'
          value={username}
          onChange={handleUsernameChange}
          placeholder='Enter your username'
          required
          className='input-text'
          id={'usernameInput'}
        />
        <input
          type='password'
          value={password}
          onChange={handlePasswordChange}
          placeholder='Enter your password'
          required
          className='input-text'
          id={'passwordInput'}
        />
        <button type='submit' className='signup-button bg-stackpurple hover:bg-stackpurplehover'>
          Create account
        </button>
      </form>
      <div>
        Already have an account? &nbsp;
        <NavLink className='font-bold' to='/'>
          Click here to login.
        </NavLink>
      </div>
    </div>
  );
};

export default Register;
