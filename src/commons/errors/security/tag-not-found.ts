import { NotFoundException } from '@nestjs/common';

export class TagtNotFoundException extends NotFoundException {
  constructor() {
    super(
      {
        id: 'security:tag:not_found',
        message: 'Tag not found',
      },
      {
        description: 'The tag was not found',
      },
    );
  }
}
