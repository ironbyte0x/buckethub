import * as v from 'valibot';

export const signInSchema = v.object({
  email: v.pipe(v.string(), v.minLength(1, 'Email is required'), v.email('Invalid email address')),
  password: v.pipe(v.string(), v.minLength(1, 'Password is required')),
  rememberMe: v.boolean()
});

export type SignInFormValues = v.InferOutput<typeof signInSchema>;
