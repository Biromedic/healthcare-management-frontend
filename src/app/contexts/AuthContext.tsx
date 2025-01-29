"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  email: string;
  roles: string[];
  firstName: string;
  lastName: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const router = useRouter();

  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  useEffect(() => {
    const storedToken = cookies.token;
    if (!storedToken) {
      setLoading(false);
      return;
    }
    validateToken(storedToken);
  }, []);

  async function validateToken(token: string) {
    try {
      const res = await axios.post(`${backend_url}/api/auth/v1/validate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.isValid) {
        setUser({
          id: res.data.userId,
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          roles: res.data.roles
        });
      } else {
        removeCookie('token');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      removeCookie('token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const res = await axios.post(`${backend_url}/api/auth/v1/signin`, { email, password });
      const token = res.data.token;
      
      setCookie('token', token, { path: '/' });
      setUser({
        id: res.data.userInfo.id,
        email: res.data.userInfo.email,
        firstName: res.data.userInfo.firstName,
        lastName: res.data.userInfo.lastName,
        roles: res.data.userInfo.roles
      });
    } catch (err) {
      throw new Error('Authentication failed');
    }
  }

  function logout() {
    removeCookie('token', { path: '/' });
    setUser(null);
    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ user, token: cookies.token ?? null, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}