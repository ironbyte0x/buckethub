import * as v from 'valibot';

export const copyObjectSchema = v.object({
  sourceKey: v.pipe(v.string(), v.minLength(1, 'Source key is required')),
  destinationFolder: v.string(),
  fileName: v.pipe(v.string(), v.minLength(1, 'Object name is required'))
});
