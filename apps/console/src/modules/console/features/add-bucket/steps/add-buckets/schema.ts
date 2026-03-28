import * as v from 'valibot';

export const addBucketsSchema = v.object({
  buckets: v.array(
    v.object({
      name: v.pipe(v.string(), v.minLength(1, 'Field is required'))
    })
  )
});

export type AddBucketsSchema = v.InferOutput<typeof addBucketsSchema>;
