import { describe, it, expect } from 'vitest';
import { Password } from '../../../../src/domain/value-objects/password';

describe('Password Value Object', () => {
  describe('create - plain password', () => {
    it('should create valid password', () => {
      const result = Password.create('Password123');
      
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('Password123');
      expect(result.getValue().hashed).toBe(false);
    });

    it('should reject password shorter than 8 characters', () => {
      const result = Password.create('Pass1');
      
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Password must be at least 8 characters');
    });

    it('should reject password without letters', () => {
      const result = Password.create('12345678');
      
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Password must contain letters');
    });

    it('should reject password without numbers', () => {
      const result = Password.create('Password');
      
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Password must contain numbers');
    });

    it('should reject empty password', () => {
      const result = Password.create('');
      
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Password is required');
    });

    it('should accept password with letters and numbers', () => {
      const result = Password.create('Abcdef12');
      
      expect(result.isSuccess).toBe(true);
    });
  });

  describe('create - hashed password', () => {
    it('should create hashed password without validation', () => {
      const hashedValue = '$2b$10$abcdefghijklmnopqrstuvwxyz123456';
      const result = Password.create(hashedValue, true);
      
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe(hashedValue);
      expect(result.getValue().hashed).toBe(true);
    });

    it('should skip validation for hashed passwords', () => {
      const result = Password.create('short', true);
      
      expect(result.isSuccess).toBe(true);
    });
  });

  describe('hash', () => {
    it('should hash plain password', async () => {
      const password = Password.create('Password123').getValue();
      const hashed = await password.hash();
      
      expect(hashed).not.toBe('Password123');
      expect(hashed.length).toBeGreaterThan(20);
      expect(hashed).toMatch(/^\$2[ab]\$/); // bcrypt format
    });

    it('should return same value if already hashed', async () => {
      const hashedValue = '$2b$10$abcdefghijklmnopqrstuvwxyz123456';
      const password = Password.create(hashedValue, true).getValue();
      const result = await password.hash();
      
      expect(result).toBe(hashedValue);
    });
  });

  describe('compare', () => {
    it('should return true for matching passwords', async () => {
      const plainPassword = 'Password123';
      const password = Password.create(plainPassword).getValue();
      const hashed = await password.hash();
      
      const hashedPassword = Password.create(hashed, true).getValue();
      const matches = await hashedPassword.compare(plainPassword);
      
      expect(matches).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password = Password.create('Password123').getValue();
      const hashed = await password.hash();
      
      const hashedPassword = Password.create(hashed, true).getValue();
      const matches = await hashedPassword.compare('WrongPassword123');
      
      expect(matches).toBe(false);
    });

    it('should return false if password is not hashed', async () => {
      const password = Password.create('Password123').getValue();
      const matches = await password.compare('Password123');
      
      expect(matches).toBe(false);
    });
  });
});
