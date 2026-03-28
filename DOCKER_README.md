# BucketHub

Unified S3 bucket management platform. Connect, explore, and manage your cloud storage from a single interface.

[GitHub](https://github.com/ironbyte0x/buckethub) | [Live Demo](https://demo.buckethub.io)

## Quick Start

```bash
docker run -d \
  --name buckethub \
  -p 3000:3000 \
  -v buckethub-data:/app/data \
  -e SECRET_ENCRYPTION_KEY=$(openssl rand -base64 32) \
  -e AUTH_SECRET=$(openssl rand -base64 32) \
  -e BASE_URL=http://localhost:3000 \
  -e ADMIN_EMAIL=admin@example.com \
  -e ADMIN_PASSWORD=changeme \
  -e ADMIN_NAME=Admin \
  ironbyte0x/buckethub
```

Then open [http://localhost:3000](http://localhost:3000) and sign in with the admin credentials you provided.

## Docker Compose

```yaml
services:
  buckethub:
    image: ironbyte0x/buckethub
    container_name: buckethub
    restart: unless-stopped
    ports:
      - '3000:3000'
    volumes:
      - buckethub-data:/app/data
    environment:
      DB_CONNECTION_STRING: data/db.db
      SECRET_ENCRYPTION_KEY: ${SECRET_ENCRYPTION_KEY} # openssl rand -base64 32
      AUTH_SECRET: ${AUTH_SECRET} # openssl rand -base64 32
      BASE_URL: https://buckethub.example.com
      ADMIN_EMAIL: admin@example.com
      ADMIN_PASSWORD: changeme
      ADMIN_NAME: Admin
      # SMTP (optional - emails are logged to console if not set)
      # SMTP_HOST: smtp.example.com
      # SMTP_PORT: 587
      # SMTP_USER: user@example.com
      # SMTP_PASS: password
      # SMTP_FROM: noreply@example.com

volumes:
  buckethub-data:
```

## Environment Variables

### Required

| Variable                | Description                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `DB_CONNECTION_STRING`  | SQLite database path (e.g. `data/db.db`)                                                  |
| `SECRET_ENCRYPTION_KEY` | Encryption key for stored credentials. Generate with `openssl rand -base64 32`            |
| `AUTH_SECRET`           | Random string (min 32 chars) for session signing. Generate with `openssl rand -base64 32` |
| `BASE_URL`              | Public URL where BucketHub is accessible (e.g. `https://buckethub.example.com`)           |
| `ADMIN_EMAIL`           | Initial admin account email                                                               |
| `ADMIN_PASSWORD`        | Initial admin account password                                                            |
| `ADMIN_NAME`            | Initial admin display name                                                                |

### Optional

| Variable          | Description                         | Default |
| ----------------- | ----------------------------------- | ------- |
| `SMTP_HOST`       | SMTP server hostname                | —       |
| `SMTP_PORT`       | SMTP server port                    | —       |
| `SMTP_USER`       | SMTP username                       | —       |
| `SMTP_PASS`       | SMTP password                       | —       |
| `SMTP_FROM`       | Sender email address                | —       |
| `AUTH_RATE_LIMIT` | Max auth requests per minute per IP | `10`    |
| `RPC_RATE_LIMIT`  | Max API requests per minute per IP  | `100`   |

When SMTP is not configured, emails (such as invitations and verification) are logged to the container console instead of being sent.

## Volumes

| Path        | Description                                                                             |
| ----------- | --------------------------------------------------------------------------------------- |
| `/app/data` | SQLite database storage. Mount a volume here to persist data across container restarts. |

## Supported Providers

- **Amazon S3**
- **Cloudflare R2**
- **MinIO**
- Any **S3-compatible** storage provider

## Image Details

- **Port:** 3000
- **Base image:** `Debian slim`
- **Architecture:** Single container with a compiled binary and static frontend assets
- **License:** [MIT](https://github.com/ironbyte0x/buckethub/blob/master/LICENSE)