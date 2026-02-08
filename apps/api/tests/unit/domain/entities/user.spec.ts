import { describe, it, expect } from 'vitest';
import { User } from '../../../../src/domain/entities/user';
import { Email } from '../../../../src/domain/value-objects/email';
import { Password } from '../../../../src/domain/value-objects/password';

describe('User Entity', () => {
  const createValidProps = () => ({
    email: Email.create('test@example.com').getValue(),
    password: Password.create('Password123', true).getValue(),
    name: 'Test User'
  });

  describe('create', () => {
    it('should create valid user', () => {
      const props = createValidProps();
      const result = User.create(props);
      
      expect(result.isSuccess).toBe(true);
      const user = result.getValue();
      expect(user.name).toBe('Test User');
      expect(user.email.value).toBe('test@example.com');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should trim name whitespace', () => {
      const props = createValidProps();
      props.name = '  Test User  ';
      const result = User.create(props);
      
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().name).toBe('Test User');
    });

    it('should reject name shorter than 2 characters', () => {
      const props = createValidProps();
      props.name = 'A';
      const result = User.create(props);
      
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Name must be at least 2 characters');
    });

    it('should reject name longer than 100 characters', () => {
      const props = createValidProps();
      props.name = 'A'.repeat(101);
      const result = User.create(props);
      
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Name must not exceed 100 characters');
    });

    it('should accept name with exactly 2 characters', () => {
      const props = createValidProps();
      props.name = 'AB';
      const result = User.create(props);
      
      expect(result.isSuccess).toBe(true);
    });

    it('should accept name with exactly 100 characters', () => {
      const props = createValidProps();
      props.name = 'A'.repeat(100);
      const result = User.create(props);
      
      expect(result.isSuccess).toBe(true);
    });
  });

  describe('updateName', () => {
    it('should update name successfully', () => {
      const props = createValidProps();
      const user = User.create(props).getValue();
      
      const result = user.updateName('New Name');
      
      expect(result.isSuccess).toBe(true);
      expect(user.name).toBe('New Name');
    });

    it('should reject invalid name', () => {
      const props = createValidProps();
      const user = User.create(props).getValue();
      
      const result = user.updateName('A');
      
      expect(result.isFailure).toBe(true);
      expect(user.name).toBe('Test User'); // Name should not change
    });
  });
});
