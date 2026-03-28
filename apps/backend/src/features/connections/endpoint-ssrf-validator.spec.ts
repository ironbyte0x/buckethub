import { lookup } from 'node:dns/promises';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InvalidUrlError } from '@buckethub/rpc-contract';
import { EndpointSSRFValidator } from './endpoint-ssrf-validator';

vi.mock('node:dns/promises', () => ({
  lookup: vi.fn()
}));

const mockedLookup = vi.mocked(lookup);

function resolves(addresses: Array<{ address: string; family: number }>) {
  mockedLookup.mockResolvedValueOnce(addresses as never);
}

function rejects() {
  mockedLookup.mockRejectedValueOnce(new Error('DNS lookup failed'));
}

describe('EndpointSSRFValidator', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('protocol validation', () => {
    it('rejects ftp protocol', async () => {
      await expect(EndpointSSRFValidator.validate('ftp://example.com')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects file protocol', async () => {
      await expect(EndpointSSRFValidator.validate('file:///etc/passwd')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects javascript protocol', async () => {
      await expect(EndpointSSRFValidator.validate('javascript:alert(1)')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects URLs with username', async () => {
      await expect(
        EndpointSSRFValidator.validate('https://user@example.com')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('rejects URLs with username and password', async () => {
      await expect(
        EndpointSSRFValidator.validate('https://user:pass@example.com')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('rejects invalid URLs', async () => {
      await expect(EndpointSSRFValidator.validate('not-a-url')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });
  });

  describe('hostname validation', () => {
    it('rejects localhost', async () => {
      await expect(EndpointSSRFValidator.validate('https://localhost')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects localhost subdomains', async () => {
      await expect(EndpointSSRFValidator.validate('https://sub.localhost')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects .local domains', async () => {
      await expect(EndpointSSRFValidator.validate('https://myhost.local')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects numeric-only hostnames', async () => {
      await expect(EndpointSSRFValidator.validate('https://12345')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });
  });

  describe('IPv4 private ranges', () => {
    it('rejects 0.x.x.x (this network)', async () => {
      await expect(EndpointSSRFValidator.validate('https://0.0.0.0')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 10.x.x.x (private class A)', async () => {
      await expect(EndpointSSRFValidator.validate('https://10.0.0.1')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 127.x.x.x (loopback)', async () => {
      await expect(EndpointSSRFValidator.validate('https://127.0.0.1')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 169.254.x.x (link-local)', async () => {
      await expect(
        EndpointSSRFValidator.validate('https://169.254.169.254')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('rejects 172.16.x.x (private class B start)', async () => {
      await expect(EndpointSSRFValidator.validate('https://172.16.0.1')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 172.31.x.x (private class B end)', async () => {
      await expect(EndpointSSRFValidator.validate('https://172.31.255.255')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 192.168.x.x (private class C)', async () => {
      await expect(EndpointSSRFValidator.validate('https://192.168.1.1')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 100.64.x.x (CGNAT start)', async () => {
      await expect(EndpointSSRFValidator.validate('https://100.64.0.1')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 100.127.x.x (CGNAT end)', async () => {
      await expect(
        EndpointSSRFValidator.validate('https://100.127.255.255')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('rejects 198.18.x.x (benchmark testing)', async () => {
      await expect(EndpointSSRFValidator.validate('https://198.18.0.1')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 198.19.x.x (benchmark testing)', async () => {
      await expect(EndpointSSRFValidator.validate('https://198.19.0.1')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 192.0.0.x (IETF protocol assignments)', async () => {
      await expect(EndpointSSRFValidator.validate('https://192.0.0.1')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 192.0.2.x (documentation TEST-NET-1)', async () => {
      await expect(EndpointSSRFValidator.validate('https://192.0.2.1')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 198.51.100.x (documentation TEST-NET-2)', async () => {
      await expect(EndpointSSRFValidator.validate('https://198.51.100.1')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 203.0.113.x (documentation TEST-NET-3)', async () => {
      await expect(EndpointSSRFValidator.validate('https://203.0.113.1')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 224.x.x.x (multicast)', async () => {
      await expect(EndpointSSRFValidator.validate('https://224.0.0.1')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects 255.255.255.255 (broadcast)', async () => {
      await expect(
        EndpointSSRFValidator.validate('https://255.255.255.255')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('allows public IPv4 (8.8.8.8)', async () => {
      await expect(EndpointSSRFValidator.validate('https://8.8.8.8')).resolves.toBeUndefined();
    });

    it('allows public IPv4 (1.1.1.1)', async () => {
      await expect(EndpointSSRFValidator.validate('https://1.1.1.1')).resolves.toBeUndefined();
    });

    it('allows 172.32.x.x (outside private range)', async () => {
      await expect(EndpointSSRFValidator.validate('https://172.32.0.1')).resolves.toBeUndefined();
    });

    it('allows 100.63.x.x (below CGNAT)', async () => {
      await expect(EndpointSSRFValidator.validate('https://100.63.0.1')).resolves.toBeUndefined();
    });

    it('allows 100.128.x.x (above CGNAT)', async () => {
      await expect(EndpointSSRFValidator.validate('https://100.128.0.1')).resolves.toBeUndefined();
    });
  });

  describe('IPv6 validation', () => {
    it('rejects loopback ::1', async () => {
      await expect(EndpointSSRFValidator.validate('https://[::1]')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects unspecified ::', async () => {
      await expect(EndpointSSRFValidator.validate('https://[::]')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects link-local fe80::', async () => {
      await expect(EndpointSSRFValidator.validate('https://[fe80::1]')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects unique local fc00::', async () => {
      await expect(EndpointSSRFValidator.validate('https://[fc00::1]')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects documentation 2001:db8::', async () => {
      await expect(EndpointSSRFValidator.validate('https://[2001:db8::1]')).rejects.toBeInstanceOf(
        InvalidUrlError
      );
    });

    it('rejects IPv4-mapped private address ::ffff:127.0.0.1', async () => {
      await expect(
        EndpointSSRFValidator.validate('https://[::ffff:127.0.0.1]')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('rejects IPv4-mapped private address ::ffff:10.0.0.1', async () => {
      await expect(
        EndpointSSRFValidator.validate('https://[::ffff:10.0.0.1]')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('rejects IPv4-mapped private address ::ffff:192.168.1.1', async () => {
      await expect(
        EndpointSSRFValidator.validate('https://[::ffff:192.168.1.1]')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('allows public IPv6 (2600::1)', async () => {
      await expect(EndpointSSRFValidator.validate('https://[2600::1]')).resolves.toBeUndefined();
    });

    it('allows IPv4-mapped public address ::ffff:8.8.8.8', async () => {
      await expect(
        EndpointSSRFValidator.validate('https://[::ffff:8.8.8.8]')
      ).resolves.toBeUndefined();
    });
  });

  describe('DNS resolution', () => {
    it('allows domain resolving to public IP', async () => {
      resolves([{ address: '93.184.216.34', family: 4 }]);

      await expect(EndpointSSRFValidator.validate('https://example.com')).resolves.toBeUndefined();
    });

    it('rejects domain resolving to private IP', async () => {
      resolves([{ address: '10.0.0.1', family: 4 }]);

      await expect(
        EndpointSSRFValidator.validate('https://evil.example.com')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('rejects domain resolving to loopback', async () => {
      resolves([{ address: '127.0.0.1', family: 4 }]);

      await expect(
        EndpointSSRFValidator.validate('https://evil.example.com')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('rejects when any resolved address is private (mixed)', async () => {
      resolves([
        { address: '93.184.216.34', family: 4 },
        { address: '10.0.0.1', family: 4 }
      ]);

      await expect(
        EndpointSSRFValidator.validate('https://dual.example.com')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('rejects DNS lookup failure', async () => {
      rejects();

      await expect(
        EndpointSSRFValidator.validate('https://nonexistent.example.com')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('rejects empty DNS response', async () => {
      resolves([]);

      await expect(
        EndpointSSRFValidator.validate('https://no-records.example.com')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });

    it('allows domain with multiple public IPs', async () => {
      resolves([
        { address: '93.184.216.34', family: 4 },
        { address: '93.184.216.35', family: 4 }
      ]);

      await expect(
        EndpointSSRFValidator.validate('https://cdn.example.com')
      ).resolves.toBeUndefined();
    });

    it('allows domain resolving to public IPv6', async () => {
      resolves([{ address: '2600:1901:0:38d7::', family: 6 }]);

      await expect(
        EndpointSSRFValidator.validate('https://ipv6.example.com')
      ).resolves.toBeUndefined();
    });

    it('rejects domain resolving to private IPv6', async () => {
      resolves([{ address: '::1', family: 6 }]);

      await expect(
        EndpointSSRFValidator.validate('https://evil-ipv6.example.com')
      ).rejects.toBeInstanceOf(InvalidUrlError);
    });
  });

  describe('accepts valid S3 endpoints', () => {
    it('allows AWS S3 endpoint', async () => {
      resolves([{ address: '52.217.171.48', family: 4 }]);

      await expect(
        EndpointSSRFValidator.validate('https://s3.amazonaws.com')
      ).resolves.toBeUndefined();
    });

    it('allows Cloudflare R2 endpoint', async () => {
      resolves([{ address: '104.18.0.1', family: 4 }]);

      await expect(
        EndpointSSRFValidator.validate('https://abc123.r2.cloudflarestorage.com')
      ).resolves.toBeUndefined();
    });

    it('allows Backblaze B2 endpoint', async () => {
      resolves([{ address: '206.190.234.1', family: 4 }]);

      await expect(
        EndpointSSRFValidator.validate('https://s3.us-west-002.backblazeb2.com')
      ).resolves.toBeUndefined();
    });

    it('allows Wasabi endpoint', async () => {
      resolves([{ address: '104.200.27.1', family: 4 }]);

      await expect(
        EndpointSSRFValidator.validate('https://s3.us-east-1.wasabisys.com')
      ).resolves.toBeUndefined();
    });

    it('allows http protocol', async () => {
      resolves([{ address: '93.184.216.34', family: 4 }]);

      await expect(
        EndpointSSRFValidator.validate('http://minio.example.com')
      ).resolves.toBeUndefined();
    });
  });
});
