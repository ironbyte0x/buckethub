export interface DroppedFile {
  path: string;
  file: File;
}

function traverseFileTree(item: FileSystemEntry, path = '') {
  return new Promise<DroppedFile[]>((resolve) => {
    if (item.isFile) {
      (item as FileSystemFileEntry).file((file) => {
        resolve([
          {
            path,
            file
          }
        ]);
      });
    } else if (item.isDirectory) {
      const directoryReader = (item as FileSystemDirectoryEntry).createReader();

      directoryReader.readEntries(async (entries) => {
        const promises = entries.reduce<Promise<DroppedFile[]>[]>((accumulatedFiles, entry) => {
          const files = traverseFileTree(entry, path + item.name + '/');

          accumulatedFiles.push(files);

          return accumulatedFiles;
        }, []);

        const files = await Promise.all(promises);

        resolve(files.flat());
      });
    } else {
      resolve([]);
    }
  });
}

export async function getFilesFromDropEvent(event: React.DragEvent<HTMLDivElement>) {
  const items = event.dataTransfer.items;

  const promises = Array.from(items).reduce<Promise<DroppedFile[]>[]>((accumulatedFiles, item) => {
    const entry = item.webkitGetAsEntry();

    if (entry) {
      const files = traverseFileTree(entry);

      accumulatedFiles.push(files);
    }

    return accumulatedFiles;
  }, []);

  const files = await Promise.all(promises);

  return files.flat();
}
