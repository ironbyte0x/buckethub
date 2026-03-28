export function getObjectUploadKey({
  basePrefix,
  path,
  name
}: {
  /**
   * The base prefix for the object key, typically derived from current folder where file upload is initiated.
   */
  basePrefix: string;
  /**
   * The file path relative to the base prefix, can include subdirectories.
   * Typically derived from the file's path in attached folder.
   */
  path: string;
  /**
   * The name of the file being uploaded.
   */
  name: string;
}) {
  return `${basePrefix}${path}${name}`;
}
