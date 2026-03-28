import { Box } from '@buckethub/styled-system/jsx';
import { Text } from '@buckethub/ui';

interface UnsupportedPreviewProps {
  contentType?: string;
}

export const UnsupportedPreview: React.FunctionComponent<UnsupportedPreviewProps> = ({
  contentType
}) => {
  return (
    <Box
      css={{
        textAlign: 'center',
        padding: '12',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text variant="body-medium" color="muted">
        Preview not available for this file type
      </Text>
      <Text variant="caption" color="subtle" css={{ marginTop: '2' }}>
        {contentType}
      </Text>
    </Box>
  );
};
