import * as v from 'valibot';

export const createTagSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, 'Tag name is required'), v.trim())
});
