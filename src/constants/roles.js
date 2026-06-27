/**
 * ROLES — User role constants sourced from Cognito User Pool Groups.
 * Always use these constants instead of raw strings.
 *
 * Cognito group name must match these values exactly.
 *
 * Usage:
 *   import { ROLES } from 'constants/roles';
 *   if (user.role === ROLES.ADMIN) { ... }
 */
export const ROLES = {
  ADMIN:    'admin',
  OPERATOR: 'operator',
  USER:     'user',
};

/** Ordered list from highest to lowest privilege */
export const ROLE_HIERARCHY = [ROLES.ADMIN, ROLES.OPERATOR, ROLES.USER];

/**
 * Returns true if `userRole` has at least the privilege level of `requiredRole`.
 * @param {string} userRole
 * @param {string} requiredRole
 */
export function hasRole(userRole, requiredRole) {
  const userIdx     = ROLE_HIERARCHY.indexOf(userRole);
  const requiredIdx = ROLE_HIERARCHY.indexOf(requiredRole);
  if (userIdx === -1 || requiredIdx === -1) return false;
  return userIdx <= requiredIdx;
}
