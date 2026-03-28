import { type LookupAddress } from 'node:dns';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { InvalidUrlError } from '@buckethub/rpc-contract';

export class EndpointSSRFValidator {
  private static parseIpv4(address: string): number[] | null {
    const octets = address.split('.');

    if (octets.length !== 4) {
      return null;
    }

    const parsedOctets = octets.map((octet) => Number(octet));

    if (parsedOctets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
      return null;
    }

    return parsedOctets;
  }

  private static isNonPublicIpv4(address: string): boolean {
    const octets = this.parseIpv4(address);

    if (!octets) {
      return true;
    }

    const [a, b, c, d] = octets;

    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 198 && (b === 18 || b === 19)) ||
      (a === 192 && b === 0 && c === 0) ||
      (a === 192 && b === 0 && c === 2) ||
      (a === 198 && b === 51 && c === 100) ||
      (a === 203 && b === 0 && c === 113) ||
      a >= 224 ||
      (a === 255 && b === 255 && c === 255 && d === 255)
    );
  }

  private static parseIpv6ToBigInt(address: string): bigint | null {
    const zoneIndex = address.indexOf('%');
    const withoutZone = zoneIndex === -1 ? address : address.slice(0, zoneIndex);
    let normalized = withoutZone.toLowerCase();

    if (normalized.includes('.')) {
      const lastColonIndex = normalized.lastIndexOf(':');

      if (lastColonIndex === -1) {
        return null;
      }

      const ipv4Address = normalized.slice(lastColonIndex + 1);
      const ipv4Octets = this.parseIpv4(ipv4Address);

      if (!ipv4Octets) {
        return null;
      }

      const upper = ((ipv4Octets[0] << 8) | ipv4Octets[1]).toString(16);
      const lower = ((ipv4Octets[2] << 8) | ipv4Octets[3]).toString(16);
      const prefix = normalized.slice(0, lastColonIndex);

      normalized = `${prefix}${prefix.endsWith(':') ? '' : ':'}${upper}:${lower}`;
    }

    const parts = normalized.split('::');

    if (parts.length > 2) {
      return null;
    }

    const left = parts[0] ? parts[0].split(':') : [];
    const right = parts.length === 2 && parts[1] ? parts[1].split(':') : [];

    if (left.some((part) => part.length === 0) || right.some((part) => part.length === 0)) {
      return null;
    }

    const missing = 8 - left.length - right.length;

    if ((parts.length === 1 && missing !== 0) || (parts.length === 2 && missing < 1)) {
      return null;
    }

    const fullParts = parts.length === 1 ? left : [...left, ...Array(missing).fill('0'), ...right];

    if (fullParts.length !== 8) {
      return null;
    }

    let value = 0n;

    for (const part of fullParts) {
      if (!/^[0-9a-f]{1,4}$/i.test(part)) {
        return null;
      }

      value = (value << 16n) + BigInt(parseInt(part, 16));
    }

    return value;
  }

  private static parseIpv6OrThrow(address: string): bigint {
    const parsed = this.parseIpv6ToBigInt(address);

    if (parsed === null) {
      throw new Error(`Invalid IPv6 address: ${address}`);
    }

    return parsed;
  }

  private static isIpv6InSubnet(address: bigint, subnet: bigint, prefixLength: number): boolean {
    const shift = 128n - BigInt(prefixLength);

    return address >> shift === subnet >> shift;
  }

  private static readonly IPV4_MAPPED_IPV6_SUBNET = this.parseIpv6OrThrow('::ffff:0:0');
  private static readonly IPV6_GLOBAL_UNICAST_SUBNET = this.parseIpv6OrThrow('2000::');
  private static readonly IPV6_DOCUMENTATION_SUBNET = this.parseIpv6OrThrow('2001:db8::');
  private static readonly ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

  private static isNonPublicIpv6(address: string): boolean {
    const ipv6 = this.parseIpv6ToBigInt(address);

    if (ipv6 === null) {
      return true;
    }

    if (this.isIpv6InSubnet(ipv6, this.IPV4_MAPPED_IPV6_SUBNET, 96)) {
      const ipv4 = Number(ipv6 & 0xffffffffn);
      const mappedIpv4 = [
        (ipv4 >>> 24) & 255,
        (ipv4 >>> 16) & 255,
        (ipv4 >>> 8) & 255,
        ipv4 & 255
      ].join('.');

      return this.isNonPublicIpv4(mappedIpv4);
    }

    if (!this.isIpv6InSubnet(ipv6, this.IPV6_GLOBAL_UNICAST_SUBNET, 3)) {
      return true;
    }

    return this.isIpv6InSubnet(ipv6, this.IPV6_DOCUMENTATION_SUBNET, 32);
  }

  private static isNonPublicIp(address: string): boolean {
    const version = isIP(address);

    if (version === 4) {
      return this.isNonPublicIpv4(address);
    }

    if (version === 6) {
      return this.isNonPublicIpv6(address);
    }

    return true;
  }

  private static normalizeHostname(hostname: string): string {
    let normalized = hostname.trim().toLowerCase();

    while (normalized.endsWith('.')) {
      normalized = normalized.slice(0, -1);
    }

    if (normalized.startsWith('[') && normalized.endsWith(']')) {
      return normalized.slice(1, -1);
    }

    return normalized;
  }

  public static async validate(endpoint: string): Promise<void> {
    let parsed: URL;

    try {
      parsed = new URL(endpoint);
    } catch {
      throw new InvalidUrlError();
    }

    if (!this.ALLOWED_PROTOCOLS.has(parsed.protocol) || parsed.username || parsed.password) {
      throw new InvalidUrlError();
    }

    const host = this.normalizeHostname(parsed.hostname);

    if (!host) {
      throw new InvalidUrlError();
    }

    if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local')) {
      throw new InvalidUrlError();
    }

    if (isIP(host)) {
      if (this.isNonPublicIp(host)) {
        throw new InvalidUrlError();
      }

      return;
    }

    if (/^\d+$/.test(host)) {
      throw new InvalidUrlError();
    }

    let resolvedAddresses: LookupAddress[];

    try {
      resolvedAddresses = await lookup(host, { all: true, verbatim: true });
    } catch {
      throw new InvalidUrlError();
    }

    if (
      resolvedAddresses.length === 0 ||
      resolvedAddresses.some((result) => this.isNonPublicIp(this.normalizeHostname(result.address)))
    ) {
      throw new InvalidUrlError();
    }
  }
}
