import { useEffect, useState } from 'react';
import { Box } from '@buckethub/styled-system/jsx';

interface TextPreviewProps {
  url: string;
}

export const TextPreview: React.FunctionComponent<TextPreviewProps> = ({ url }) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    fetch(url)
      .then((response) => response.text())
      .then(setContent)
      .catch(() => setContent('Failed to load content'));
  }, [url]);

  return (
    <Box
      css={{
        height: '100%',
        overflow: 'auto'
      }}
    >
      <Box
        as="pre"
        css={{
          backgroundColor: 'background-surface',
          padding: '4',
          borderRadius: 'lg',
          height: '100%',
          fontSize: 'sm',
          lineHeight: '1.6',
          fontFamily: 'monospace',
          overflow: 'auto',
          margin: '0',
          color: 'text-base'
        }}
      >
        {content}
      </Box>
    </Box>
  );
};
