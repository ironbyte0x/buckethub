/**
 * Formats bytes into a human-readable string with appropriate unit (B, KB, MB, GB, TB, PB)
 *
 * @param bytes - The size in bytes
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted string like "2.50 GB" or "1.23 MB"
 *
 * @example
 * formatSize(1024) // "1.00 KB"
 * formatSize(1536, 0) // "2.00 KB"
 * formatSize(2500000000) // "2.33 GB"
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 B';
  }

  if (bytes < 0) {
    return 'Invalid size';
  }

  const kilobyteFactor = 1024;
  const calculatedDecimals = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const sizeIndex = Math.floor(Math.log(bytes) / Math.log(kilobyteFactor));
  const formattedValue = parseFloat(
    (bytes / Math.pow(kilobyteFactor, sizeIndex)).toFixed(calculatedDecimals)
  ).toFixed(calculatedDecimals);

  return `${formattedValue} ${sizes[sizeIndex]}`;
}
