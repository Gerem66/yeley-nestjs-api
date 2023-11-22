import { ApiProperty } from '@nestjs/swagger';
import { EstablishmentType } from 'src/commons/constants';
import { TagDto } from 'src/modules/tags/dtos/tag.dto';

export class EstablishmentDto {
  constructor(parameters: EstablishmentDto) {
    Object.assign(this, parameters);
  }

  @ApiProperty({ example: '<uuid>' })
  id: string;

  @ApiProperty({ example: 'Paul Bakery' })
  name: string;

  @ApiProperty({ example: ['<tag>', '<tag>'] })
  tags: TagDto[];

  @ApiProperty({ example: '9 rue du plaisir, Montpellier, 34000' })
  fullAddress: string;

  @ApiProperty({ example: [10.0, 20.0] })
  coordinates: number[];

  @ApiProperty({ example: ['<uuid.png>', '<uuid.jpg>'] })
  picturesPaths: string[];

  @ApiProperty({ example: 0 })
  likes: number;

  @ApiProperty({ example: '<phone>' })
  phone: string;

  @ApiProperty({ example: EstablishmentType.restaurant })
  type: EstablishmentType;

  @ApiProperty({ example: '<date>' })
  createdAt: Date;
}
