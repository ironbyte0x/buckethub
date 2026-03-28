import * as v from 'valibot';

export const selectConnectionSchema = v.object({
  connectionId: v.string('Field is required')
});

export type SelectConnectionSchema = v.InferOutput<typeof selectConnectionSchema>;
