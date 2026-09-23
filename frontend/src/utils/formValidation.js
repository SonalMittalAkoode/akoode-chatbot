export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_DIGITS_REGEX = /^\d{7,15}$/;

export function normalizeEmail(value = "") {
  return String(value).trim().toLowerCase();
}

export function sanitizePhone(value = "") {
  return String(value).replace(/\D/g, "").slice(0, 15);
}

export function isValidEmail(value = "") {
  return EMAIL_REGEX.test(normalizeEmail(value));
}

export function isValidPhone(value = "") {
  return PHONE_DIGITS_REGEX.test(sanitizePhone(value));
}
