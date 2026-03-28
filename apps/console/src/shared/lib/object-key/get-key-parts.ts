export function getKeyParts(key?: string) {
  if (!key) {
    return [];
  }

  return key.split('/').filter(Boolean);
}
