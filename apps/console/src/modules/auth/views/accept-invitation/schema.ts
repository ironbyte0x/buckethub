import * as v from 'valibot';

export const acceptInvitationSchema = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.minLength(1, 'Name is required')),
    password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters')),
    confirmPassword: v.pipe(v.string(), v.minLength(1, 'Please confirm your password'))
  }),
  v.forward(
    v.check((data) => data.password === data.confirmPassword, 'Passwords do not match'),
    ['confirmPassword']
  )
);
