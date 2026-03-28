export function getKeyPrefix(key?: string) {
  if (!key) {
    return '';
  }

  const isFolder = key.endsWith('/');

  if (isFolder) {
    return key;
  }

  const lastSlashIndex = key.lastIndexOf('/');

  if (lastSlashIndex === -1) {
    return '';
  }

  return key.substring(0, lastSlashIndex + 1);
}
