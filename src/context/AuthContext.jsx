import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUserApi, loginApi, registerApi, logoutApi } from "../api/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await getCurrentUserApi();
      if (response && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Listen for global unauthorized events from Axios interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    await loginApi(credentials);
    await fetchCurrentUser();
  };

  const register = async (data) => {
    const res = await registerApi(data);
    return res;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refetchUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
