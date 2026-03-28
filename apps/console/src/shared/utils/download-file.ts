export function downloadFile(url: string, fileName: string) {
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;

  document.body.append(link);

  link.click();
  link.remove();
}
