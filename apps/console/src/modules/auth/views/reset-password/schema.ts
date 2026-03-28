import * as v from 'valibot';

export const resetPasswordSchema = v.pipe(
  v.object({
    newPassword: v.pipe(
      v.string(),
      v.minLength(1, 'Password is required'),
      v.minLength(8, 'Password must be at least 8 characters')
    ),
    confirmPassword: v.pipe(v.string(), v.minLength(1, 'Please confirm your password'))
  }),
  v.forward(
    v.check((data) => data.newPassword === data.confirmPassword, 'Passwords do not match'),
    ['confirmPassword']
  )
);

export type ResetPasswordFormValues = v.InferOutput<typeof resetPasswordSchema>;
