"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/auth/v1/validate', {}, {
          headers: { Authorization: `Bearer ${cookies.token}` }
        });
        
        if (response.data.isValid) {
          setUser({
            id: response.data.userId,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            roles: response.data.roles
          });
        }
      } catch (error) {
        removeCookie('token');
      } finally {
        setLoading(false);
      }
    };

    if (cookies.token) validateToken();
    else setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('http://localhost:8080/api/auth/v1/signin', {
      email,
      password
    });

    setCookie('token', response.data.token, { path: '/' });
    setUser({
      id: response.data.userInfo.id,
      email: response.data.userInfo.email,
      firstName: response.data.userInfo.firstName,
      lastName: response.data.userInfo.lastName,
      roles: response.data.userInfo.roles
    });
  };

  const logout = () => {
    removeCookie('token');
    setUser(null);
    axios.post('http://localhost:8080/api/auth/v1/sign-out');
  };

  return (
    <AuthContext.Provider value={{ user, token: cookies.token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);