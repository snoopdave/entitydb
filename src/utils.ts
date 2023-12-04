import * as crypto from 'crypto';

export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function convertTimestamp(timestamp: number): Date {
  return new Date(timestamp);
}

export function fixEncoding(str: string): string {
  // Convert the string to a buffer using the original encoding (likely Windows-1252 or ISO-8859-1)
  const buffer = Buffer.from(str, 'binary');

  // Convert the buffer to a UTF-8 string
  return buffer.toString('utf8');
}