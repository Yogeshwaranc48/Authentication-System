import validator from 'validator';

export const sanitizeString = (value) => {
  if (typeof value !== 'string') {
    return '';
  }

  return validator.trim(value);
};

export const normalizeEmail = (email) => {
  if (typeof email !== 'string') {
    return '';
  }

  return validator.normalizeEmail(validator.trim(email), {
    gmail_remove_dots: false,
  }) || validator.trim(email).toLowerCase();
};

export const sanitizeUserInput = ({ username, email, password, confirmPassword }) => ({
  username: typeof username === 'string' ? validator.trim(username) : '',
  email: normalizeEmail(email),
  password: typeof password === 'string' ? password : '',
  confirmPassword: typeof confirmPassword === 'string' ? confirmPassword : '',
});

export const sanitizeLoginInput = ({ email, password }) => ({
  email: normalizeEmail(email),
  password: typeof password === 'string' ? password : '',
});
