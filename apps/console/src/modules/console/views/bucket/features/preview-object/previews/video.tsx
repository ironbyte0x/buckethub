import { Box } from '@buckethub/styled-system/jsx';

interface VideoPreviewProps {
  url: string;
  title?: string;
}

export const VideoPreview: React.FunctionComponent<VideoPreviewProps> = ({ url, title }) => {
  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6',
        minHeight: '400px'
      }}
    >
      <video
        src={url}
        controls
        title={title}
        style={{
          maxWidth: '100%',
          maxHeight: '70vh',
          borderRadius: '8px'
        }}
      />
    </Box>
  );
};
