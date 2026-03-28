import type { BaseIssue, BaseSchema, Brand, GenericSchema, InferInput, InferOutput } from 'valibot';

/**
 * Wraps a Valibot schema so that the brand applies to **both** the input and
 * the output type, matching Zod's `brand<Name, 'inout'>` behavior.
 *
 * Valibot's built-in `v.brand()` only brands the output, which causes type
 * mismatches with libraries that check `StandardSchema['~standard']['types']['input']`
 * against branded value types (e.g. TanStack Form validators).
 *
 * At runtime this is a no-op — branding is purely a type-level concept.
 */
export function brand<TSchema extends GenericSchema, TName extends string>(
  schema: TSchema,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _name: TName
): BaseSchema<
  InferInput<TSchema> & Brand<TName>,
  InferOutput<TSchema> & Brand<TName>,
  BaseIssue<unknown>
> {
  return schema as unknown as BaseSchema<
    InferInput<TSchema> & Brand<TName>,
    InferOutput<TSchema> & Brand<TName>,
    BaseIssue<unknown>
  >;
}
