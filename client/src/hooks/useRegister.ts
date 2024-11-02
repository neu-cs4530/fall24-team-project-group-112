import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import useLoginContext from './useLoginContext';
import { User } from '../types';
import addUser from '../services/userService';

/**
 * Custom hook to handle account registration/creation input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns handleInputChange - Function to handle changes in the input field.
 * @returns handleSubmit - Function to handle login submission
 */
const useRegister = () => {
  const [firstName, setfirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to handle the first name input change event.
   *
   * @param e - the event object.
   */
  const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setfirstName(e.target.value);
  };

  /**
   * Function to handle the last name input change event.
   *
   * @param e - the event object.
   */
  const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  /**
   * Function to handle the email input change event.
   *
   * @param e - the event object.
   */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  /**
   * Function to handle the username input change event.
   *
   * @param e - the event object.
   */
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  /**
   * Function to handle the password input change event.
   *
   * @param e - the event object.
   */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let isValid = true;
    if (!username || !password || !firstName || !lastName || !email) {
      setTextErr('You can not leave any of the fields empty');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    event.preventDefault();
    const user: User = {
      username,
      firstName,
      lastName,
      email,
      createdAt: new Date(),
    };

    try {
      const res = await addUser(user, password);
      if (res) {
        // setUser({ res.username });
        // navigate to the question that was answered
        navigate(`/`);
      }
    } catch (err) {
      if (err instanceof Error) {
        setTextErr(`${err.message}`);
      }
    }
  };

  return {
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
  };
};

export default useRegister;
