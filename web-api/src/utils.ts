import * as crypto from 'crypto';
import * as jschardet from 'jschardet';

export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function convertTimestamp(timestamp: number): Date {
  return new Date(timestamp);
}

export function unescapeJsonString(escapedJsonString: string): string {
  // Parse the JSON string, then stringify it to get the unescaped string
  return JSON.stringify(JSON.parse(`"${escapedJsonString}"`));
}

export function fixEncoding(str: string): string {
  // Convert the string to a buffer using the original encoding (likely Windows-1252 or ISO-8859-1)
  const buffer = Buffer.from(str, 'binary');

  // Convert the buffer to a UTF-8 string
  return buffer.toString('utf8');
}
