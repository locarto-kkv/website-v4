import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);

  const login = (type) => {
    setCurrentUser(true);
    setUserType(type);
  };

  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
  };

  const value = {
    currentUser,
    userType,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};