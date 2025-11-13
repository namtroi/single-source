export function isSupportedImage(file: any) {
  // 1. Basic check for null/undefined input
  if (!file || !file.type) {
    return false;
  }

  const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
  ];

  // 3. Check if the file's MIME type is in the allowed list
  return ALLOWED_TYPES.includes(file.type);
}