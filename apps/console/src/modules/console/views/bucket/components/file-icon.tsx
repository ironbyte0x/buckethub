import {
  ArchiveIcon,
  CodeIcon,
  FileIcon as DefaultFileIcon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
  MusicIcon,
  VideoIcon
} from 'lucide-react';
import { Object } from '@buckethub/rpc-contract';
import { Icon } from '@buckethub/ui';

interface FileIconProps extends React.ComponentProps<typeof Icon> {
  object: Object;
}

export const FileIcon: React.FunctionComponent<FileIconProps> = ({ object, ...props }) => {
  const getIcon = () => {
    if (object.type === 'folder') {
      return FolderIcon /* className={`${size} text-blue-500`} */;
    }

    const extension = object.key?.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return ImageIcon /* className={`${size} text-green-500`} */;
      case 'txt':
      case 'md':
      case 'doc':
      case 'docx':
        return FileTextIcon; /* className={`${size} text-blue-500`} */
      case 'zip':
      case 'rar':
      case 'tar':
      case 'gz':
        return ArchiveIcon; /* className={`${size} text-orange-500`} */
      case 'mp4':
      case 'avi':
      case 'mov':
        return VideoIcon; /* className={`${size} text-purple-500`} */
      case 'mp3':
      case 'wav':
      case 'flac':
        return MusicIcon; /* className={`${size} text-pink-500`} */
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'py':
      case 'java':
        return CodeIcon; /* className={`${size} text-yellow-500`} */
      default:
        return DefaultFileIcon; /* className={`${size} text-gray-500`} */
    }
  };

  const IconComponent = getIcon();

  return <Icon as={IconComponent} {...props} />;
};
