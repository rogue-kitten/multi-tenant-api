import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  applicationId: z.string().uuid(),
  password: z.string().min(6),
  initialUser: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  applicationId: z.string().uuid(),
});

const loginUserReplySchema = z.object({
  accessToken: z.string(),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;

const assignRoleSchema = z.object({
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
  applicationId: z.string().uuid(),
});

export type AssignRoleInput = z.infer<typeof assignRoleSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  loginUserSchema,
  loginUserReplySchema,
  assignRoleSchema,
});
