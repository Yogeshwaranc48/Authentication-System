const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => {
  if (!email?.trim()) {
    return 'Email is required';
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address';
  }

  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  return '';
};

export const validateUsername = (username) => {
  if (!username?.trim()) {
    return 'Username is required';
  }

  if (username.trim().length < 3) {
    return 'Username must be at least 3 characters';
  }

  if (username.trim().length > 30) {
    return 'Username cannot exceed 30 characters';
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
    return 'Username may only contain letters, numbers, and underscores';
  }

  return '';
};

export const validateRegisterForm = ({ username, email, password, confirmPassword }) => {
  const errors = {};

  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
};
