import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistException extends ConflictException {
  constructor() {
    super(
      {
        id: 'security:user:exists',
        message: 'User already exists',
      },
      {
        description: 'A user with the same email/phone already exists',
      },
    );
  }
}
