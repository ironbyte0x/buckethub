import { CSSProperties } from 'react';

export const colors = {
  pageBackground: '#f4f4f5',
  cardBackground: '#ffffff',
  cardBorder: '#e4e4e7',
  heading: '#09090b',
  body: '#3f3f46',
  buttonBackground: '#18181b',
  buttonText: '#fafafa',
  muted: '#a1a1aa',
  link: '#52525b'
};

export const fontFamily =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif';

export const main: CSSProperties = {
  backgroundColor: colors.pageBackground,
  fontFamily,
  padding: '40px 0'
};

export const card: CSSProperties = {
  backgroundColor: colors.cardBackground,
  border: `1px solid ${colors.cardBorder}`,
  borderRadius: '12px',
  margin: '0 auto',
  padding: '40px 32px',
  maxWidth: '480px'
};

export const logoContainer: CSSProperties = {
  textAlign: 'center',
  padding: '0 0 24px 0'
};

export const logoText: CSSProperties = {
  color: colors.heading,
  fontSize: '16px',
  fontWeight: 600,
  fontFamily,
  margin: '12px 0 0 0',
  textAlign: 'center'
};

export const separator: CSSProperties = {
  borderTop: `1px solid ${colors.cardBorder}`,
  borderBottom: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  margin: '24px 0'
};

export const heading: CSSProperties = {
  color: colors.heading,
  fontSize: '20px',
  fontWeight: 600,
  margin: '0 0 16px 0',
  padding: '0',
  textAlign: 'center'
};

export const bodyText: CSSProperties = {
  color: colors.body,
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 16px 0'
};

export const buttonContainer: CSSProperties = {
  textAlign: 'center',
  margin: '24px 0'
};

export const button: CSSProperties = {
  backgroundColor: colors.buttonBackground,
  borderRadius: '8px',
  color: colors.buttonText,
  fontSize: '15px',
  fontWeight: 600,
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '12px 24px'
};

export const link: CSSProperties = {
  color: colors.link,
  fontSize: '13px',
  textDecoration: 'underline',
  wordBreak: 'break-all'
};

export const footer: CSSProperties = {
  color: colors.muted,
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 8px 0'
};

export const copyright: CSSProperties = {
  color: colors.muted,
  fontSize: '12px',
  textAlign: 'center',
  margin: '24px 0 0 0'
};
