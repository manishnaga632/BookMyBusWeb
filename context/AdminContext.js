
// 'use client';
// import React, { createContext, useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// export const AdminContext = createContext();

// export const AdminProvider = ({ children }) => {
//   const router = useRouter();
//   const [admin, setAdmin] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [authChecked, setAuthChecked] = useState(false); 

//   useEffect(() => {
//     const savedToken = localStorage.getItem('admin_token');
//     if (savedToken && savedToken !== 'undefined' && savedToken !== 'null') {
//       setToken(savedToken);
//       fetchAdminProfile(savedToken);
//     } else {
//       setLoading(false);
//       setAuthChecked(true);
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setLoading(true);
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password });
//       const { access_token } = response.data;

//       localStorage.setItem('admin_token', access_token);
//       setToken(access_token);
//       localStorage.removeItem('token');

//       const isAdminUser = await fetchAdminProfile(access_token);
//       if (!isAdminUser) {
//         logout();
//         return { success: false, message: 'Not authorized as admin' };
//       }

//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.response?.data?.detail || 'Login failed' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAdminProfile = async (token) => {
//     if (!token) {
//       setLoading(false);
//       setAuthChecked(true);
//       return false;
//     }
//     try {
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const profile = response.data;
//       const isAdmin = profile.id === 1 || profile.role === 'admin';
//       if (!isAdmin) return false;

//       setAdmin(profile);
//       return true;
//     } catch (error) {
//       if (error.response?.status === 401) logout();
//       return false;
//     } finally {
//       setLoading(false);
//       setAuthChecked(true);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('admin_token');
//     setToken(null);
//     setAdmin(null);
//     router.push('/admin');
//   };

//   return (
//     <AdminContext.Provider value={{ 
//       admin, 
//       token, 
//       login, 
//       logout, 
//       loading, 
//       authChecked, 
//       setAdmin 
//     }}>
//       {children}
//     </AdminContext.Provider>
//   );
// };

// export const useAdminContext = () => useContext(AdminContext);


'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken && savedToken !== 'undefined' && savedToken !== 'null') {
      setToken(savedToken);
      fetchAdminProfile(savedToken);
    } else {
      setLoading(false);
      setAuthChecked(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });

      const { access_token, user_info } = response.data;

      // ✅ Strict check: allow only user_id === 1 and role === 'admin'
      const isValidAdmin = user_info?.id === 1 && user_info?.role === 'admin';
      if (!isValidAdmin) {
        return { success: false, message: 'Only user ID 1 with admin role can log in' };
      }

      localStorage.setItem('admin_token', access_token);
      localStorage.removeItem('token'); // Remove user token if any
      setToken(access_token);
      setAdmin(user_info);
      setAuthChecked(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminProfile = async (token) => {
    if (!token) {
      setLoading(false);
      setAuthChecked(true);
      return false;
    }
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = response.data;
      const isValidAdmin = profile.id === 1 && profile.role === 'admin';
      if (!isValidAdmin) {
        logout(); // Force logout if invalid admin
        return false;
      }

      setAdmin(profile);
      return true;
    } catch (error) {
      if (error.response?.status === 401) logout();
      return false;
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setAdmin(null);
    router.push('/admin');
  };

  return (
    <AdminContext.Provider value={{
      admin,
      token,
      login,
      logout,
      loading,
      authChecked,
      setAdmin
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminContext);
