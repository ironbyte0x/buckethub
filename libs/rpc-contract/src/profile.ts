import * as v from 'valibot';
import { oc } from '@orpc/contract';

const THEMES = ['light', 'dark', 'system'] as const;

export const themeSchema = v.picklist(THEMES);

export type Theme = v.InferOutput<typeof themeSchema>;

export const profileSchema = v.object({
  id: v.string(),
  name: v.pipe(v.string(), v.minLength(1)),
  email: v.pipe(v.string(), v.email()),
  image: v.nullable(v.string())
});

export type Profile = v.InferOutput<typeof profileSchema>;

export const preferencesSchema = v.object({
  theme: themeSchema
});

export type Preferences = v.InferOutput<typeof preferencesSchema>;

const getProfile = oc.input(v.void()).output(profileSchema);

const updateProfile = oc
  .input(
    v.object({
      name: v.optional(v.pipe(v.string(), v.minLength(1))),
      email: v.optional(v.pipe(v.string(), v.email())),
      image: v.optional(v.nullable(v.string()))
    })
  )
  .output(profileSchema)
  .errors({
    EMAIL_ALREADY_EXISTS: { status: 409 }
  });

const getPreferences = oc.input(v.void()).output(preferencesSchema);

const updatePreferences = oc
  .input(
    v.object({
      theme: v.optional(themeSchema)
    })
  )
  .output(preferencesSchema);

export const profile = {
  getProfile,
  updateProfile,
  getPreferences,
  updatePreferences
};
