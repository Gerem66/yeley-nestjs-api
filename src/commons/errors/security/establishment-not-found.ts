import { NotFoundException } from '@nestjs/common';

export class EstablishmentNotFoundException extends NotFoundException {
  constructor() {
    super(
      {
        id: 'security:establishment:not_found',
        message: 'Establishment not found',
      },
      {
        description: 'The establishment was not found',
      },
    );
  }
}
