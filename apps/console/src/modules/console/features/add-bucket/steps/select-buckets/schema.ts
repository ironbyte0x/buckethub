import * as v from 'valibot';

export const selectBucketsSchema = v.object({
  buckets: v.pipe(
    v.array(v.object({ name: v.pipe(v.string(), v.minLength(1)), checked: v.boolean() })),
    v.check(
      (buckets) => buckets.some((bucket) => bucket.checked),
      'At least one bucket must be selected'
    )
  )
});

export type SelectBucketsSchema = v.InferOutput<typeof selectBucketsSchema>;
