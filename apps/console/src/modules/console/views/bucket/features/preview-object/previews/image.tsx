import { Box } from '@buckethub/styled-system/jsx';

interface ImagePreviewProps {
  url: string;
  alt?: string;
}

export const ImagePreview: React.FunctionComponent<ImagePreviewProps> = ({ url, alt }) => {
  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6',

        lg: {
          minHeight: '400px'
        }
      }}
    >
      <img
        src={url}
        alt={alt}
        style={{
          maxWidth: '100%',
          maxHeight: '70vh',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          borderRadius: '8px'
        }}
      />
    </Box>
  );
};
