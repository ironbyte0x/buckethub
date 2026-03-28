export function getIsFileKey(key?: string) {
  if (!key) {
    return false;
  }

  return !key.endsWith('/');
}
