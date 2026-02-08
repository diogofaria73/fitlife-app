import { describe, it, expect } from 'vitest';
import { Email } from '../../../../src/domain/value-objects/email';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create valid email', () => {
      const result = Email.create('test@example.com');
      
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('test@example.com');
    });

    it('should convert email to lowercase', () => {
      const result = Email.create('Test@EXAMPLE.COM');
      
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const result = Email.create('  test@example.com  ');
      
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('test@example.com');
    });

    it('should reject invalid email format', () => {
      const result = Email.create('invalid-email');
      
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject empty email', () => {
      const result = Email.create('');
      
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Email is required');
    });

    it('should reject email without @', () => {
      const result = Email.create('testexample.com');
      
      expect(result.isFailure).toBe(true);
    });

    it('should reject email without domain', () => {
      const result = Email.create('test@');
      
      expect(result.isFailure).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for equal emails', () => {
      const email1 = Email.create('test@example.com').getValue();
      const email2 = Email.create('test@example.com').getValue();
      
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = Email.create('test1@example.com').getValue();
      const email2 = Email.create('test2@example.com').getValue();
      
      expect(email1.equals(email2)).toBe(false);
    });
  });
});
