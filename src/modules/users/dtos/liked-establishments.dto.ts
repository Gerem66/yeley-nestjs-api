import { ApiProperty } from '@nestjs/swagger';
import { EstablishmentDto } from 'src/modules/establishments/dtos/establishment.dto';

export class LikedEstablishmentsDto {
  constructor(parameters: LikedEstablishmentsDto) {
    Object.assign(this, parameters);
  }

  @ApiProperty({ isArray: true })
  likedEstablishments: EstablishmentDto[];
}
