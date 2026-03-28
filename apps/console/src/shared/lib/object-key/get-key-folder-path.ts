export function getKeyFolderPath(key?: string) {
  if (!key) {
    return '';
  }

  return key.substring(0, key.lastIndexOf('/') + 1);
}
