import { IsArray, IsEnum, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstablishmentType } from 'src/commons/constants';

export class CreateEstablishmentDto {
  @ApiProperty({ example: 'Paul Bakery', description: 'Establishment name' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Establishment type',
    example: ['<uuid>', '<uuid>'],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  readonly tags: string[];

  @ApiProperty({
    example: 'Paul 11 rue de la machine, Montpellier, 34000',
    description: 'Establishment full address',
  })
  @IsString()
  readonly fullAddress: string;

  @ApiProperty({
    example: [10.0, 20.0],
    description: 'Establishment coordinates Long Lat',
    isArray: true,
  })
  @IsArray()
  readonly coordinates: number[];

  @ApiProperty({
    example: '+339000000',
    description: 'Establishment phone number',
  })
  @IsString()
  readonly phone: string;

  @ApiProperty({
    description: 'Establishment type',
    enum: EstablishmentType,
    example: EstablishmentType.restaurant,
  })
  @IsEnum(EstablishmentType)
  readonly type: EstablishmentType;

  @ApiProperty({
    example: true,
    description: 'Priorité de l\'établissement pour le tri',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly priority?: boolean;
}
