import { useState } from 'react';

const useLocalStorage = () => {
  const [value, setValue] = useState<string | null>(null);

  const setItem = (key: string, val: string) => {
    localStorage.setItem(key, val);
    setValue(val);
  };

  const getItem = (key: string) => {
    const val = localStorage.getItem(key);
    setValue(val);
    return val;
  };

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
    setValue(null);
  };

  return { value, setItem, getItem, removeItem };
};

export default useLocalStorage;
