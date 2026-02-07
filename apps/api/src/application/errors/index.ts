export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UserAlreadyExistsError extends ApplicationError {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message: string = 'Forbidden') {
    super(message);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}
