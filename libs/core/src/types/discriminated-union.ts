/**
 * Picks properties from a discriminated union while preserving the union structure.
 *
 * @example
 * type Animal =
 *   | { type: 'dog'; breed: string; age: number }
 *   | { type: 'cat'; color: string; age: number };
 *
 * type AnimalWithoutAge = PickFromUnion<Animal, 'type' | 'breed' | 'color'>;
 * // Results in:
 * // | { type: 'dog'; breed: string }
 * // | { type: 'cat'; color: string }
 */
export type PickFromUnion<T, K extends PropertyKey> = T extends unknown
  ? Pick<T, Extract<keyof T, K>>
  : never;
