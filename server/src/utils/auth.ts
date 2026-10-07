import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'securewifi_super_secret_jwt_key_change_in_production_2026';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: object, expiresIn: string | number = '8h'): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 to 4
  strength: 'Weak' | 'Medium' | 'Strong';
  errors: string[];
}

export function validatePasswordPolicy(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    errors.push('Password must be at least 8 characters long');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain at least one number (0-9)');
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  let strength: 'Weak' | 'Medium' | 'Strong' = 'Weak';
  if (score >= 5) {
    strength = 'Strong';
  } else if (score >= 3) {
    strength = 'Medium';
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    score: Math.min(score, 4),
    strength,
    errors,
  };
}
