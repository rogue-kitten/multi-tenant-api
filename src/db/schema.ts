import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const application = pgTable('application', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

/**
 * The third argument for the users table,
 * This creates a composite primary key which states that the combination of the user's email and the application key would be unique
 */
export const user = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    applicationId: uuid('applicationId').references(() => application.id),
    password: varchar('password', { length: 256 }).notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  },
  (users) => ({
    cpk: primaryKey(users.email, users.applicationId),
    idIndex: uniqueIndex('users_id_index').on(users.id),
  })
);

export const roles = pgTable(
  'roles',
  {
    id: uuid('id').defaultRandom().notNull(),
    name: varchar('name', { length: 256 }),
    applicationId: uuid('applicationId').references(() => application.id),
    permissions: text('permissions').array().$type<Array<string>>(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
  },
  (roles) => ({
    cpk: primaryKey(roles.name, roles.applicationId),
    idIndex: uniqueIndex('roles_id_index').on(roles.id),
  })
);

export const usersToRoles = pgTable(
  'usersToRoles',
  {
    applicationId: uuid('applicationId')
      .references(() => application.id)
      .notNull(),

    roleId: uuid('roleId')
      .references(() => roles.id)
      .notNull(),

    userId: uuid('userId')
      .references(() => user.id)
      .notNull(),
  },
  (userToRole) => ({
    cpk: primaryKey(
      userToRole.applicationId,
      userToRole.roleId,
      userToRole.userId
    ),
  })
);
