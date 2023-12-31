export const ALL_PERMISSIONS = [
  'users:role:write', //allowed to add a role to a user,
  'users:role:delete', //allowed to remove a role from a user
  'role:create', //allowed to create a new application role

  //posts
  'posts:delete',
  'posts:write',
  'posts:read',
  'posts:edit-own',
] as const;

export const PERMISSIONS = ALL_PERMISSIONS.reduce((acc, permission) => {
  acc[permission] = permission;
  return acc;
}, {} as Record<(typeof ALL_PERMISSIONS)[number], (typeof ALL_PERMISSIONS)[number]>);

export const USER_ROLE_PERMISSIONS = [
  PERMISSIONS['posts:read'],
  PERMISSIONS['posts:write'],
];

export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  APPLICATION_USER: 'APPLICATION_USER',
};
