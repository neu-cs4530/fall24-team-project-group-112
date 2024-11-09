/**
 * Custom hook to access the browser's localStorage API.
 *
 * @returns setItem - Function to set a value in localStorage.
 * @returns getItem - Function to get a value from localStorage.
 * @returns removeItem - Function to remove a value from localStorage.
 *
 */
const useLocalStorage = () => {
  const setItem = (key: string, val: string) => {
    localStorage.setItem(key, val);
  };

  const getItem = (key: string) => {
    const val = localStorage.getItem(key);
    return val;
  };

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
};

export default useLocalStorage;
