import { ProviderType } from '@buckethub/core';

interface ProviderOption {
  value: ProviderType;
  label: string;
  shortLabel?: string;
  productLabel: string;
  description: string;
  endpointTemplate?: string;
}

export const PROVIDERS = [
  {
    value: ProviderType.AmazonS3,
    label: 'Amazon Web Services',
    shortLabel: 'AWS',
    productLabel: 'S3',
    description: 'Amazon Simple Storage Service',
    endpointTemplate: 'https://s3.amazonaws.com'
  },
  {
    value: ProviderType.CloudflareR2,
    label: 'Cloudflare',
    shortLabel: 'Cloudflare',
    productLabel: 'R2',
    description: "Cloudflare's object storage solution",
    endpointTemplate: 'https://{account_id}.r2.cloudflarestorage.com'
  },
  {
    value: ProviderType.MinIO,
    label: 'MinIO',
    shortLabel: 'MinIO',
    productLabel: 'MinIO',
    description: 'High performance, S3 compatible object storage'
  },
  {
    value: ProviderType.BackblazeB2,
    label: 'Backblaze',
    shortLabel: 'Backblaze',
    productLabel: 'B2',
    description: 'Scalable cloud storage',
    endpointTemplate: 'https://s3.{region}.backblazeb2.com'
  },
  {
    value: ProviderType.Wasabi,
    label: 'Wasabi',
    shortLabel: 'Wasabi',
    productLabel: 'Wasabi',
    description: 'Hot cloud storage',
    endpointTemplate: 'https://s3.{region}.wasabisys.com'
  },
  {
    value: ProviderType.DigitalOceanSpaces,
    label: 'DigitalOcean',
    shortLabel: 'DigitalOcean',
    productLabel: 'Spaces',
    description: 'Scalable object storage with built-in CDN',
    endpointTemplate: 'https://{region}.digitaloceanspaces.com'
  },
  {
    value: ProviderType.Other,
    label: 'Other',
    productLabel: 'Other',
    description: 'Other object storage solutions'
  }
] satisfies ProviderOption[];

export type Provider = (typeof PROVIDERS)[number];

export const PROVIDERS_BY_TYPE: Record<ProviderType, Provider> = PROVIDERS.reduce(
  (accumulator, provider) => {
    accumulator[provider.value] = provider;

    return accumulator;
  },
  {} as Record<ProviderType, Provider>
);
