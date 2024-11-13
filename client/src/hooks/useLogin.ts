import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import useLoginContext from './useLoginContext';
import useLocalStorage from './useLocalStorage';
import { loginUser } from '../services/userService';
/**
 * Custom hook to handle login input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns handleInputChange - Function to handle changes in the input field.
 * @returns handleSubmit - Function to handle login submission
 */
const useLogin = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useLoginContext();
  const { setItem } = useLocalStorage();
  const navigate = useNavigate();

  /**
   * Function to handle input change event for both email and password fields.
   *
   * @param e - The event object.
   * @param field - The field being updated ('email' or 'password').
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    if (field === 'email') {
      setEmail(e.target.value);
    } else if (field === 'password') {
      setPassword(e.target.value);
    }
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let isValid = true;
    if (!email || !password) {
      setError('You can not leave any of the fields empty');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    event.preventDefault();

    try {
      const res = await loginUser(email, password);

      if ('status' in res) {
        setError(res.error);
      } else {
        const user = {
          username: res.username,
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          badges: res.badges,
          createdAt: res.createdAt,
          
          headline: res.headline || '',
          bio: res.bio || '',
          githubUrl: res.githubUrl || '',
          company: res.company || '',
          school: res.school || '',
          city: res.city || '',
          state: res.state || '',
          avatarName: res.avatarName || '',
        };

        setUser(user);
        setItem('user', JSON.stringify(user));

        setError('');
        navigate('/home');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`${err.message}`);
      }
    }
  };

  return { email, password, handleInputChange, handleSubmit, error };
};

export default useLogin;
