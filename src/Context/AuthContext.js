import React, { createContext, useContext, useState, useEffect } from 'react';

// Define constant for local storage key
const LOCAL_STORAGE_KEY = 'userId';

// Create the AuthContext
export const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  // State to store the userId
  const [userId, setUserIdState] = useState(() => {
    // Retrieve userId from localStorage, if available
    return localStorage.getItem(LOCAL_STORAGE_KEY) || '';
  });

  // Function to set the userId
  const setUserId = (newUserId) => {
    // Update the state
    setUserIdState(newUserId);
    // Store the userId in localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, newUserId);
  };

  // Effect to update userId in localStorage if it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, userId);
  }, [userId]);

  // Provide the userId and setUserId to the child components
  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};


