export async function adminRequest<T>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Admin request failed.');
  return result as T;
}

export async function uploadAdminImage(file: File, onProgress?: (percent: number) => void): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 3 * 1024 * 1024) {
    throw new Error('Choose a JPEG, PNG, or WebP image up to 3 MB.');
  }
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Could not read image.'));
    reader.onerror = () => reject(new Error('Could not read image.'));
    reader.readAsDataURL(file);
  });
  const response = await new Promise<XMLHttpRequest>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.upload.onprogress = event => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onerror = () => reject(new Error('Image upload failed. Check your connection and retry.'));
    xhr.onload = () => resolve(xhr);
    xhr.send(JSON.stringify({ action: 'image.upload', contentType: file.type, base64: dataUrl.split(',')[1] }));
  });
  const result = JSON.parse(response.responseText) as { url?: string; error?: string };
  if (response.status < 200 || response.status >= 300 || !result.url) {
    throw new Error(result.error || 'Image upload failed.');
  }
  return result.url;
}
