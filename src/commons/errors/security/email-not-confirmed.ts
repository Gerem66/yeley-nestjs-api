import { UnauthorizedException } from '@nestjs/common';

export class EmailNotConfirmedException extends UnauthorizedException {
  constructor() {
    super(
      {
        id: 'security:email:not_confirmed',
        message: 'Email address not confirmed',
      },
      {
        description: 'The email address needs to be confirmed before logging in',
      },
    );
  }
}