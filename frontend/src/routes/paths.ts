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
  CHECKLIST: '/checklist',
  KNOWLEDGE_ASSESSMENT: '/assessments/knowledge',
  WHO5_ASSESSMENT: '/assessments/who5',
  PSOC_ASSESSMENT: '/assessments/psoc',
  GROWTH: '/growth',
  ADD_GROWTH_READING: '/growth/add',
  LEARN: '/learn',
  PROFILE: '/profile',
  DANGER_SIGNS: '/danger-signs',
  ADMIN_PARTICIPANTS: '/admin/participants',
  ADMIN_PARTICIPANT_DETAIL: '/admin/participants/:id',
  ADMIN_HOSPITALS: '/admin/hospitals',
  TDSC: '/assessments/tdsc',
  IMMUNIZATION: '/immunization',
  BREASTFEEDING_ASSESSMENT: '/assessments/breastfeeding',
  MESSAGE_HISTORY: '/messages',
  NURSE_HOME: '/nurse',
  NURSE_PARTICIPANT_DETAIL: '/nurse/participants/:id',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];

/**
 * The mother-facing dashboard calls mother-only endpoints (e.g.
 * `/dashboard/home`), so researcher/nurse accounts must never land there —
 * it 403s and shows a generic error. Use this everywhere a post-auth
 * landing route is chosen (login, PIN login, PIN creation, root redirect).
 */
export function getHomeRouteForRole(role: string | undefined): string {
  if (role === 'researcher') return ROUTES.ADMIN_PARTICIPANTS;
  if (role === 'nurse') return ROUTES.NURSE_HOME;
  return ROUTES.DASHBOARD;
}
