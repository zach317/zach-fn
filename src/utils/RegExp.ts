export const USERNAME_PATTERN: RegExp = /^[a-zA-Z][a-zA-Z0-9_-]{3,15}$/
export const PASSWORD_PATTERN: RegExp = /(?=.*[\d])?(?=.*[a-zA-Z])(?=.*[\d]){8,16}/
export const NO_SPACER_PATTERN: RegExp = /^[^\s]*$/
export const PHONE_PATTERN: RegExp = /^1\d{10}$/
export const EMAIL_PATTERN: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/