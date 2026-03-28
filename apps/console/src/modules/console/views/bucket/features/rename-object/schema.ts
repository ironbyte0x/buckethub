import * as v from 'valibot';

export const renameObjectSchema = v.pipe(
  v.object({
    oldKey: v.pipe(v.string(), v.minLength(1)),
    newKey: v.pipe(v.string(), v.minLength(1))
  }),
  v.forward(
    v.check((data) => data.oldKey !== data.newKey, 'New and old key must be different'),
    ['newKey']
  )
);
