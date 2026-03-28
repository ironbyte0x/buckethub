import * as v from 'valibot';
import { UserRole } from '@buckethub/core';
import { oc } from '@orpc/contract';

const roleEnum = v.picklist([UserRole.Admin, UserRole.User]);

const userSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.pipe(v.string(), v.email()),
  image: v.nullable(v.string()),
  role: v.nullable(roleEnum),
  banned: v.nullable(v.boolean()),
  banReason: v.nullable(v.string()),
  banExpires: v.nullable(v.date()),
  createdAt: v.date()
});

export type User = v.InferOutput<typeof userSchema>;

const list = oc.input(v.void()).output(v.array(userSchema));

const getById = oc.input(v.object({ id: v.string() })).output(v.nullable(userSchema));

const updateRole = oc
  .input(
    v.object({
      userId: v.string(),
      role: roleEnum
    })
  )
  .output(v.void());

const ban = oc
  .input(
    v.object({
      userId: v.string(),
      reason: v.optional(v.string()),
      expiresIn: v.optional(v.number())
    })
  )
  .output(v.void());

const unban = oc.input(v.object({ userId: v.string() })).output(v.void());

const remove = oc.input(v.object({ userId: v.string() })).output(v.void());

export const users = {
  list,
  getById,
  updateRole,
  ban,
  unban,
  remove
};
