import * as v from 'valibot';

export const forgotPasswordSchema = v.object({
  email: v.pipe(v.string(), v.minLength(1, 'Email is required'), v.email('Invalid email address'))
});

export type ForgotPasswordFormValues = v.InferOutput<typeof forgotPasswordSchema>;
