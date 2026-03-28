interface PdfPreviewProps {
  url: string;
  title?: string;
}

export const PdfPreview: React.FunctionComponent<PdfPreviewProps> = ({ url, title }) => {
  return (
    <iframe
      src={url}
      title={title}
      style={{
        width: '100%',
        height: '70vh',
        border: 'none',
        borderRadius: '8px'
      }}
    />
  );
};
