const STORAGE_KEY = 'last-visited-bucket-id';

export function getLastVisitedBucketId(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setLastVisitedBucketId(bucketId: string): void {
  localStorage.setItem(STORAGE_KEY, bucketId);
}
