import { ApiProperty } from '@nestjs/swagger';
import { EstablishmentType } from 'src/commons/constants';

export class TagDto {
  constructor(parameters: TagDto) {
    Object.assign(this, parameters);
  }

  @ApiProperty({ example: '<uuid>' })
  id: string;

  @ApiProperty({ example: 'Japonais' })
  value: string;

  @ApiProperty({ example: EstablishmentType.restaurant })
  type: EstablishmentType;

  @ApiProperty({ example: '<uuid>' })
  picturePath: string | null;

  @ApiProperty({ example: '<date>' })
  createdAt: Date;
}
