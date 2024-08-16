import React, { createContext, useState, useContext, useEffect } from 'react';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const poolData = {
  UserPoolId: 'us-east-1_AFThndVE8',
  ClientId: '4640c342l6dlhskivbpr8v7aeq',
};

const UserPool = new CognitoUserPool(poolData);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    role: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');
    const storedRole = localStorage.getItem('role');
    if (storedName && storedEmail && storedRole) {
      setIsLoggedIn(true);
      setUserDetails({
        name: storedName,
        email: storedEmail,
        role: storedRole,
      });
    }
  }, []);

  const login = details => {
    setIsLoggedIn(true);
    setUserDetails(details);
    localStorage.setItem('name', details.name);
    localStorage.setItem('email', details.email);
    localStorage.setItem('role', details.role);
  };

  const logout = () => {
    const cognitoUser = UserPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    setIsLoggedIn(false);
    setUserDetails({ name: '', email: '', role: '' });
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
