import { randomBytes, scrypt as _scrypt, createHash } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

/**
 * Hashes a password using scrypt with a random salt
 * @param password The password to hash
 * @returns A promise that resolves to an object containing the hashed password and salt
 */
export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  try {
    const salt = randomBytes(16).toString('hex');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    
    return {
      hash: hash.toString('hex'),
      salt
    };
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Error hashing password');
  }
}

/**
 * Verifies a password against a stored hash and salt
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  salt: string
): Promise<boolean> {
  try {
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    return hash.toString('hex') === storedHash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Common validation for user input
 */
export function validateUserInput(input: {
  email: string;
  userName: string;
  password: string;
  confirmPassword?: string;
}): { valid: boolean; error?: string } {
  if (!input.email || !input.userName || !input.password) {
    return { valid: false, error: 'All fields are required' };
  }

  if (input.confirmPassword && input.password !== input.confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

/**
 * Generates a secure random token
 * @param length The length of the token in bytes (default: 32)
 * @returns A random token string
 */
export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Hashes a string using SHA-256
 * @param input The string to hash
 * @returns The hashed string
 */
export function hashString(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}
