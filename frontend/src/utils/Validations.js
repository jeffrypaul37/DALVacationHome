export const validateName = value => {
  if (!value.trim()) return 'Name is required.';
  return '';
};

export const validatePassword = value => {
  if (!value.trim()) return 'Please enter a Password.';
  return '';
};

export const validateSecurityAnswer = value => {
  if (!value.trim()) return 'Security Answer is required.';
  return '';
};

export const validateShiftKey = value => {
  if (!value.trim()) return 'Shift Value for Caesar Cipher is required.';
  return '';
};

export const validateCipher = value => {
  if (!value.trim()) return 'Please decrypt the Cipher Key.';
  return '';
};

export const validateEmail = value => {
  if (!value.trim()) return 'Email is required.';
  if (!/\S+@\S+\.\S+/.test(value)) return 'Email address is invalid.';
  return '';
};

export const validateRole = value => {
  if (!value.trim()) return 'Role must be selected.';
  return '';
};

export const validateSecurityQuestion = value => {
  if (!value) return 'Security Question must be selected.';
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword.trim()) return 'Please confirm your Password.';
  if (password !== confirmPassword) return 'Passwords do not match.';
  return '';
};
