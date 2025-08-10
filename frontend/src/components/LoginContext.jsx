import React, { createContext, useState, useEffect } from 'react';


export const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = tokenManager.isAuthenticated();
      setAccess(isAuth);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = () => {
    setAccess(true);
  };

  const logout = () => {
    tokenManager.removeToken();
    setAccess(false);
  };

  return (
    <LoginContext.Provider value={{ access, login, logout, loading }}>
      {children}
    </LoginContext.Provider>
  );
};