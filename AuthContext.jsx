import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, ApiError, getStoredToken, setStoredToken, removeStoredToken } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getCurrentUser = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return null;
    }

    try {
      const response = await api.getCurrentUser();
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response.data.user;
    } catch {
      removeStoredToken();
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const login = useCallback(async (credentials) => {
    setLoading(true);

    try {
      const response = await api.login(credentials);
      const { user: authenticatedUser, token } = response.data;

      setStoredToken(token);
      setUser(authenticatedUser);
      setIsAuthenticated(true);

      return authenticatedUser;
    } catch (error) {
      removeStoredToken();
      setUser(null);
      setIsAuthenticated(false);

      throw error instanceof ApiError
        ? error
        : new ApiError('Login failed. Please try again.', 500);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);

    try {
      const response = await api.register(payload);
      const { user: newUser, token } = response.data;

      setStoredToken(token);
      setUser(newUser);
      setIsAuthenticated(true);

      return newUser;
    } catch (error) {
      removeStoredToken();
      setUser(null);
      setIsAuthenticated(false);

      throw error instanceof ApiError
        ? error
        : new ApiError('Registration failed. Please try again.', 500);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);

    try {
      if (getStoredToken()) {
        await api.logout();
      }
    } catch {
      // Clear local state even if server logout fails
    } finally {
      removeStoredToken();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      getCurrentUser,
    }),
    [user, loading, isAuthenticated, login, register, logout, getCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
