import { Box } from '@buckethub/styled-system/jsx';

interface AudioPreviewProps {
  url: string;
  title?: string;
}

export const AudioPreview: React.FunctionComponent<AudioPreviewProps> = ({ url, title }) => {
  return (
    <Box
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8'
      }}
    >
      <audio src={url} controls title={title} style={{ width: '100%' }} />
    </Box>
  );
};
