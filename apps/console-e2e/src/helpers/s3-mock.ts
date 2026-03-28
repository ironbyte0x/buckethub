export class S3MockClient {
  constructor(private readonly endpoint: string) {}

  public async createBucket(bucketName: string): Promise<void> {
    const url = `${this.endpoint}/${bucketName}`;

    const response = await fetch(url, { method: 'PUT' });

    if (!response.ok && response.status !== 409) {
      throw new Error(`Failed to create bucket ${bucketName}: ${response.status}`);
    }
  }

  public async putObject(bucketName: string, key: string, content: string | Buffer): Promise<void> {
    const url = `${this.endpoint}/${bucketName}/${key}`;

    const response = await fetch(url, {
      method: 'PUT',
      body: content,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to put object ${key} in ${bucketName}: ${response.status}`);
    }
  }

  public async deleteObject(bucketName: string, key: string): Promise<void> {
    const url = `${this.endpoint}/${bucketName}/${key}`;

    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete object ${key} from ${bucketName}: ${response.status}`);
    }
  }

  public async listObjects(bucketName: string, prefix?: string): Promise<string[]> {
    let url = `${this.endpoint}/${bucketName}?list-type=2`;

    if (prefix) {
      url += `&prefix=${encodeURIComponent(prefix)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to list objects in ${bucketName}: ${response.status}`);
    }

    const text = await response.text();
    const keys: string[] = [];
    const regex = /<Key>([^<]+)<\/Key>/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      keys.push(match[1]);
    }

    return keys;
  }

  public async deleteAllObjects(bucketName: string): Promise<void> {
    const keys = await this.listObjects(bucketName);

    for (const key of keys) {
      await this.deleteObject(bucketName, key);
    }
  }
}
