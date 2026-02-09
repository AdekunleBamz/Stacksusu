/**
 * UUID and ID generation utilities
 */

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a short ID
 */
export function generateShortId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a nanoid (URL-safe)
 */
export function generateNanoid(size = 21): string {
  const alphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';
  let id = '';
  let bytes = crypto.getRandomValues(new Uint8Array(size));
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] % alphabet.length];
  }
  return id;
}

/**
 * Generate a ULID (Universally Unique Lexicographically Sortable ID)
 */
export function generateULID(): string {
  const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const ENCODING_LEN = ENCODING.length;

  let ulid = '';
  const now = Date.now().toString(36);
  
  // Timestamp (10 chars)
  while (now.length < 10) {
    ulid += '0';
  }
  ulid += now;
  
  // Randomness (16 chars)
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  for (let i = 0; i < 16; i++) {
    ulid += ENCODING[bytes[i] % ENCODING_LEN];
  }
  
  return ulid;
}

/**
 * Generate a snowflake ID
 */
let snowflakeCounter = Math.floor(Math.random() * 4096);
let snowflakeLastTime = 0;

export function generateSnowflakeId(): bigint {
  const now = BigInt(Date.now());
  
  if (now !== BigInt(snowflakeLastTime)) {
    snowflakeCounter = 0;
    snowflakeLastTime = Number(now);
  }
  
  const timestamp = now << 22n;
  const worker = 0n << 17n;
  const counter = BigInt(snowflakeCounter) << 12n;
  
  snowflakeCounter = (snowflakeCounter + 1) % 4096;
  
  return timestamp | worker | counter;
}

/**
 * Generate a KSUID (K-Sortable Unique ID)
 */
export function generateKSUID(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(36);
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const randomPart = Array.from(randomBytes, (b) => b.toString(36).padStart(2, '0')).join('');
  return timestamp + randomPart;
}

/**
 * Parse UUID to binary
 */
export function uuidToBinary(uuid: string): Uint8Array {
  const hex = uuid.replace(/-/g, '');
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Parse binary to UUID
 */
export function binaryToUUID(bytes: Uint8Array): string {
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Validate UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate a ticket ID
 */
export function generateTicketId(prefix = 'TKT'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateShortId(6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generate an invitation code
 */
export function generateInviteCode(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
