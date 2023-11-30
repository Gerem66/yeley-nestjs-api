import { NotFoundException } from '@nestjs/common';

export class InvalidPasswordException extends NotFoundException {
  constructor() {
    super(
      {
        id: 'security:password:not_matching',
        message: 'Wrong password',
      },
      {
        description: 'The password does not match',
      },
    );
  }
}
