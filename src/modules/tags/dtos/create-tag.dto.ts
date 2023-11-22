import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { EstablishmentType } from 'src/commons/constants';

export class CreateTagDto {
  constructor(parameters: CreateTagDto) {
    Object.assign(this, parameters);
  }

  @ApiProperty({ example: 'Japonais', description: 'Tag name' })
  @IsString()
  readonly value: string;

  @ApiProperty({
    example: EstablishmentType.restaurant,
    description: 'Tag name',
    enum: EstablishmentType,
  })
  @IsEnum(EstablishmentType)
  readonly type: EstablishmentType;
}
