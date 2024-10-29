import React from 'react';
import './index.css';
import useLogin from '../../hooks/useLogin';

/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const { username, password, error, handleSubmit, handleInputChange } = useLogin();

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>Sign into your account.</h4>
      <form className='login-form' onSubmit={handleSubmit}>
        <input
          type='text'
          value={username}
          name='username'
          onChange={handleInputChange}
          placeholder='Enter your username'
          required
          className='input-text'
          id={'usernameInput'}
        />
        <input
          type='password'
          value={password}
          name='password'
          onChange={handleInputChange}
          placeholder='Enter your password'
          required
          className='input-text'
          id={'passwordInput'}
        />
        {error && <p className='error-message'>{error}</p>}
        <button type='submit' className='login-button'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
