import React from 'react';
import './index.css';
import useLogin from '../../hooks/useLogin';
/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const { email, password, handleSubmit, handleInputChange, error } = useLogin();

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>Please enter your email and password</h4>
      <form className='username-and-password' onSubmit={handleSubmit}>
        <input
          type='text'
          value={email}
          onChange={e => handleInputChange(e, 'email')}
          placeholder='Enter your email'
          required
          className='input-text'
          id={'emailInput'}
        />
        <input
          type='password'
          value={password}
          onChange={e => handleInputChange(e, 'password')}
          placeholder='Enter your password'
          required
          className='input-text'
          id='passwordInput'
        />
        {error && <div className='error-message'>{error}</div>}
        <button type='submit' className='login-button'>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
