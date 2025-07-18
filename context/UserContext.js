

'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false); // New state for login loading

  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const savedToken = localStorage.getItem('token');

    const initializeAuth = async () => {
      try {
        if (savedToken && savedToken !== 'undefined' && savedToken !== 'null') {
          setToken(savedToken);
          await fetchUserProfile(savedToken);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      setLoginLoading(true); // Set login-specific loading state
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
      const { access_token } = response.data;

      const userProfile = await fetchUserProfile(access_token, true);
      if (!userProfile) {
        return { success: false, message: 'Unable to fetch user profile' };
      }

      if (userProfile.role === 'admin' || userProfile.id === 1) {
        logout();
        return { success: false, message: 'Invalid user' };
      }

      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUserInfo(userProfile);

      // Redirect after login
      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/profile';
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectTo);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Login failed',
      };
    } finally {
      setLoginLoading(false); // Reset login-specific loading state
    }
  };

  const fetchUserProfile = async (tokenToUse, returnProfile = false) => {
    if (!tokenToUse) {
      setLoading(false);
      setAuthChecked(true);
      return null;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });

      setUserInfo(response.data);
      if (returnProfile) return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      if (returnProfile) return null;
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserInfo(null);
    setAuthChecked(true);
    router.push('/login');
  };

  const refreshUser = async () => {
    await fetchUserProfile(token);
  };

  return (
    <UserContext.Provider
      value={{
        userInfo,
        user: userInfo,
        token,
        loading,
        loginLoading, // Expose the loginLoading state
        authChecked,
        login,
        logout,
        setUserInfo,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserContext };