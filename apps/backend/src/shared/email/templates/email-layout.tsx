import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text
} from '@react-email/components';
import { card, copyright, logoContainer, logoText, main, separator } from './shared-styles';

const LOGO_BASE64 =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODEiIGhlaWdodD0iODEiIHZpZXdCb3g9IjAgMCA4MSA4MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjE2IiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMTk3XzI2OTUpIi8+CjxwYXRoIGQ9Ik00MC41IDMxLjE2NjVDNTIuMDk4IDMxLjE2NjUgNjEuNSAyOC4wMzI1IDYxLjUgMjQuMTY2NUM2MS41IDIwLjMwMDUgNTIuMDk4IDE3LjE2NjUgNDAuNSAxNy4xNjY1QzI4LjkwMiAxNy4xNjY1IDE5LjUgMjAuMzAwNSAxOS41IDI0LjE2NjVDMTkuNSAyOC4wMzI1IDI4LjkwMiAzMS4xNjY1IDQwLjUgMzEuMTY2NVoiIHN0cm9rZT0iI0ZBRkFGQSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE5LjUgMjQuMTY2NVY1Ni44MzMyQzE5LjUgNTguNjg5NyAyMS43MTI1IDYwLjQ3MDIgMjUuNjUwOCA2MS43ODI5QzI5LjU4OSA2My4wOTU3IDM0LjkzMDUgNjMuODMzMiA0MC41IDYzLjgzMzJDNDYuMDY5NSA2My44MzMyIDUxLjQxMSA2My4wOTU3IDU1LjM0OTIgNjEuNzgyOUM1OS4yODc1IDYwLjQ3MDIgNjEuNSA1OC42ODk3IDYxLjUgNTYuODMzMlYyNC4xNjY1IiBzdHJva2U9IiNGQUZBRkEiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xOS41IDQwLjVDMTkuNSA0Mi4zNTY1IDIxLjcxMjUgNDQuMTM3IDI1LjY1MDggNDUuNDQ5N0MyOS41ODkgNDYuNzYyNSAzNC45MzA1IDQ3LjUgNDAuNSA0Ny41QzQ2LjA2OTUgNDcuNSA1MS40MTEgNDYuNzYyNSA1NS4zNDkyIDQ1LjQ0OTdDNTkuMjg3NSA0NC4xMzcgNjEuNSA0Mi4zNTY1IDYxLjUgNDAuNSIgc3Ryb2tlPSIjRkFGQUZBIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDBfbGluZWFyXzE5N18yNjk1IiB4MT0iMC41MDAwMDEiIHkxPSI0LjI1IiB4Mj0iNzUuNSIgeTI9IjgwLjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzNCODJGNiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM5MzMzRUEiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4=';

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export const EmailLayout = ({ preview, children }: EmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={card}>
          <Section style={logoContainer}>
            <Img
              src={LOGO_BASE64}
              width="40"
              height="40"
              alt="BucketHub"
              style={{ margin: '0 auto' }}
            />
            <Text style={logoText}>BucketHub</Text>
          </Section>
          <Hr style={separator} />
          {children}
          <Hr style={separator} />
          <Text style={{ ...copyright, margin: '0' }}>&copy; 2026 BucketHub</Text>
        </Container>
      </Body>
    </Html>
  );
};

EmailLayout.displayName = 'EmailLayout';
