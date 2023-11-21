import * as crypto from 'crypto';

export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function convertTimestamp(timestamp: number): Date {
  return new Date(timestamp);
}
