import { type RandomReader, generateRandomString } from '@oslojs/crypto/random'

/**
 * Uses Web Crypto API to encrypt a string using AES encryption.
 */
export async function encrypt(value: string, seed: string) {
  const iv = generateIV()
  const key = await deriveKeyForEncoding(seed)

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    stringToArrayBuffer(value),
  )

  // Combine the IV and the ciphertext for easier handling
  const resultBuffer = new Uint8Array(iv.byteLength + encrypted.byteLength)
  resultBuffer.set(iv)
  resultBuffer.set(new Uint8Array(encrypted), iv.byteLength)

  // Encode the result to Base64 for easier storage/transfer
  return btoa(String.fromCharCode(...resultBuffer))
}

/**
 * Uses Web Crypto API to decrypt a string using AES encryption.
 */
export async function decrypt(value: string, seed: string) {
  // Decode the Base64 input
  const encryptedBuffer = base64ToArrayBuffer(value)

  // Extract the IV and ciphertext
  const ivLength = 12 // 96-bit IV for AES-GCM
  const iv = encryptedBuffer.slice(0, ivLength)
  const ciphertext = encryptedBuffer.slice(ivLength)

  const key = await deriveKeyForDecoding(seed)

  // Decrypt the ciphertext
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext,
  )

  // Convert the ArrayBuffer back to a string
  return new TextDecoder().decode(decrypted)
}

export function randomString(bytes = 10) {
  const random: RandomReader = {
    read(bytes) {
      crypto.getRandomValues(bytes)
    },
  }

  /**
	 * List of characters in upper, lower, digits and special characters.
	 */
  const alphabet =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'

  return generateRandomString(random, alphabet, bytes)
}

// Convert a string to an ArrayBuffer
function stringToArrayBuffer(value: string) {
  return new TextEncoder().encode(value)
}

// Derive a key from the seed using SHA-256
async function deriveKeyForEncoding(seed: string) {
  const seedBuffer = stringToArrayBuffer(seed)
  const hash = await crypto.subtle.digest('SHA-256', seedBuffer)
  return crypto.subtle.importKey('raw', hash, 'AES-GCM', false, ['encrypt'])
}

async function deriveKeyForDecoding(seed: string) {
  const seedBuffer = stringToArrayBuffer(seed)
  const hash = await crypto.subtle.digest('SHA-256', seedBuffer)
  return crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' }, // Algorithm definition
    false, // Key is not extractable
    ['encrypt', 'decrypt'], // Allow both encryption and decryption
  )
}

// Generate a random initialization vector
function generateIV() {
  return crypto.getRandomValues(new Uint8Array(12)) // 96-bit IV for AES-GCM
}

// Convert a Base64 string to an ArrayBuffer
function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64)
  const buffer = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    buffer[i] = binaryString.charCodeAt(i)
  }
  return buffer
}
