const TOKEN_KEY = 'auth_token';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const request = async (endpoint, options = {}) => {
  const token = getStoredToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: 'An unexpected error occurred',
  }));

  if (!response.ok || data.success === false) {
    throw new ApiError(data.message || 'Request failed', response.status);
  }

  return data;
};

export const api = {
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () => request('/auth/me'),

  getProfile: () => request('/profile'),
};

export { ApiError };
