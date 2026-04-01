const DEMO_UPLOAD_URL_PREFIX = 'demo://upload';

interface PatchedPrototype {
  open: (method: string, url: string | URL, async?: boolean) => void;
  send: XMLHttpRequest['send'];
}

export function installUploadInterceptor(): void {
  const prototype = XMLHttpRequest.prototype as unknown as PatchedPrototype;
  const originalOpen = prototype.open;
  const originalSend = prototype.send;

  prototype.open = function (this: XMLHttpRequest, method: string, url: string | URL) {
    this.__demoUpload = method === 'PUT' && String(url).startsWith(DEMO_UPLOAD_URL_PREFIX);

    originalOpen.call(this, method, url, true);
  };

  XMLHttpRequest.prototype.send = function (
    this: XMLHttpRequest,
    body?: Document | XMLHttpRequestBodyInit | null
  ) {
    if (!this.__demoUpload) {
      return originalSend.call(this, body);
    }

    const totalSize =
      body instanceof Blob
        ? body.size
        : body instanceof ArrayBuffer
          ? body.byteLength
          : typeof body === 'string'
            ? body.length
            : 0;

    const delay = 500 + Math.random() * 500;

    setTimeout(() => {
      this.upload.dispatchEvent(
        new ProgressEvent('progress', {
          lengthComputable: true,
          loaded: totalSize / 2,
          total: totalSize
        })
      );
    }, delay * 0.4);

    setTimeout(() => {
      this.upload.dispatchEvent(
        new ProgressEvent('progress', {
          lengthComputable: true,
          loaded: totalSize,
          total: totalSize
        })
      );

      Object.defineProperty(this, 'status', { value: 200, writable: false });
      Object.defineProperty(this, 'readyState', { value: 4, writable: false });

      this.onload?.(new ProgressEvent('load'));
    }, delay);
  };
}

declare global {
  interface XMLHttpRequest {
    __demoUpload?: boolean;
  }
}
