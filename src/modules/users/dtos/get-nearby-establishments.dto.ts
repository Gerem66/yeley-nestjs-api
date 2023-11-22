import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';
import { EstablishmentType } from 'src/commons/constants';

export class GetNearbyEstablishmentsDto {
  constructor(parameters: GetNearbyEstablishmentsDto) {
    Object.assign(this, parameters);
  }

  @ApiProperty({ example: 10, description: 'Range expressed as circle, in KM' })
  @IsNumber()
  range: number;

  @ApiProperty({
    example: [10.1367, 74.8984],
    description: 'Long Lat coordinates of the user position',
    isArray: true,
  })
  @IsArray()
  coordinates: number[];

  @ApiProperty({
    example: EstablishmentType.restaurant,
    description: 'Establishment type',
  })
  @IsEnum(EstablishmentType)
  type: EstablishmentType;

  @ApiProperty({
    example: ['<uuid>', '<uuid>'],
    description: 'Tags used as filters',
    isArray: true,
  })
  @IsString({ each: true })
  @IsArray()
  tags: string[];
}
