/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/no-unused-vars */
const CONFIG = {
  apiUrl: 'https://api.buckethub.dev',
  maxRetries: 3,
  timeout: 30000,
  supportedFormats: ['jpg', 'png', 'gif', 'webp', 'mp4', 'pdf']
};

class StorageClient {
  constructor(options) {
    this.baseUrl = options.apiUrl || CONFIG.apiUrl;
    this.retries = options.maxRetries || CONFIG.maxRetries;
  }

  async listBuckets() {
    const response = await fetch(`${this.baseUrl}/buckets`);

    return response.json();
  }

  async getObject(bucketId, key) {
    const response = await fetch(`${this.baseUrl}/buckets/${bucketId}/objects/${key}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch object: ${response.statusText}`);
    }

    return response.json();
  }

  async uploadFile(bucketId, file, options = {}) {
    const formData = new FormData();

    formData.append('file', file);

    if (options.prefix) {
      formData.append('prefix', options.prefix);
    }

    const response = await fetch(`${this.baseUrl}/buckets/${bucketId}/upload`, {
      method: 'POST',
      body: formData
    });

    return response.json();
  }

  isPreviewable(contentType) {
    const previewable = [
      'image/',
      'video/',
      'audio/',
      'application/pdf',
      'text/',
      'application/json',
      'application/xml'
    ];

    return previewable.some((type) => contentType.startsWith(type));
  }
}

console.log('StorageClient initialized');
