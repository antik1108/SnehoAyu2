export const ROUTES = {
  ROOT: '/',
  LANGUAGE_SELECT: '/language-select',
  WELCOME: '/welcome',
  LOGIN: '/login',
  PIN_LOGIN: '/login/pin',
  SIGNUP: '/signup',
  SIGNUP_PHONE: '/signup/phone',
  CREATE_PIN: '/signup/create-pin',
  MOTHER_PROFILE: '/signup/mother-profile',
  BABY_PROFILE: '/signup/baby-profile',
  HOSPITAL_CODE: '/signup/hospital-code',
  SIGNUP_COMPLETE: '/signup/complete',
  DASHBOARD: '/dashboard',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
