import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

const createApplicationSchema = z.object({
  name: z.string({
    required_error: 'Application Name is required',
    invalid_type_error: 'Name must be a string',
  }),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

const createApplicationReplySchema = z.object({
  name: z.string(),
  id: z.string(),
  createdAt: z.string(),
});

export const { schemas: applicationSchemas, $ref } = buildJsonSchemas(
  {
    createApplicationSchema,
    createApplicationReplySchema,
  },
  {
    $id: 'applicationSchema',
  }
);
