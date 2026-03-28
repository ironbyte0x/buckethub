import * as v from 'valibot';
import { oc } from '@orpc/contract';

const invitationSchema = v.object({
  id: v.string(),
  email: v.pipe(v.string(), v.email()),
  createdAt: v.date(),
  expiresAt: v.date()
});

export type Invitation = v.InferOutput<typeof invitationSchema>;

const send = oc
  .input(v.object({ email: v.pipe(v.string(), v.email()) }))
  .output(v.object({ id: v.string() }));

const list = oc.input(v.void()).output(v.array(invitationSchema));

const revoke = oc.input(v.object({ id: v.string() })).output(v.void());

const getByToken = oc
  .input(v.object({ token: v.string() }))
  .output(v.nullable(v.object({ email: v.pipe(v.string(), v.email()) })));

const accept = oc
  .input(
    v.object({
      token: v.string(),
      name: v.pipe(v.string(), v.minLength(1)),
      password: v.pipe(v.string(), v.minLength(8))
    })
  )
  .output(v.void());

export const invitations = {
  send,
  list,
  revoke,
  getByToken,
  accept
};
