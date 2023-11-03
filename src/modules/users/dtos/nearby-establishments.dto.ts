import { ApiProperty } from '@nestjs/swagger';
import { EstablishmentDto } from 'src/modules/establishments/dtos/establishment.dto';

export class NearbyEstablishmentsDto {
  constructor(parameters: NearbyEstablishmentsDto) {
    Object.assign(this, parameters);
  }

  @ApiProperty({ isArray: true })
  nearbyEstablishments: EstablishmentDto[];
}
