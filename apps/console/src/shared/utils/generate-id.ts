export function generateId<T extends string>() {
  return crypto.randomUUID() as T;
}
