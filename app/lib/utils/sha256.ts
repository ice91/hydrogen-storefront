// app/lib/utils/sha256.ts

/**
 * Generates a SHA-256 hash of the given message using the Web Crypto API.
 *
 * @param {string} message - The input string to hash.
 * @returns {Promise<string>} - The hexadecimal representation of the hash.
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message); // Encode as UTF-8
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer); // Hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join(''); // Convert bytes to hex string
  return hashHex;
}