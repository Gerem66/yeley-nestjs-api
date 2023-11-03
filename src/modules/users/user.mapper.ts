import { EstablishmentDto } from 'src/modules/establishments/dtos/establishment.dto';
import { EstablishmentEntity } from 'src/modules/establishments/establishments.entity';
import { NearbyEstablishmentsDto } from 'src/modules/users/dtos/nearby-establishments.dto';
import { LikedEstablishmentsDto } from 'src/modules/users/dtos/liked-establishments.dto';

export class UserMapper {
  static toLikedEstablishmentsDto(
    entities: EstablishmentEntity[],
  ): LikedEstablishmentsDto {
    const likedEstablishments: EstablishmentDto[] = [];
    for (const likedEstablishment of entities) {
      likedEstablishments.push(new EstablishmentDto(likedEstablishment));
    }
    return new LikedEstablishmentsDto({
      likedEstablishments: likedEstablishments,
    });
  }

  static toNearbyEstablishmentsDto(
    entities: EstablishmentEntity[],
  ): NearbyEstablishmentsDto {
    const nearbyEstablishments: EstablishmentDto[] = [];
    for (const likedEstablishment of entities) {
      nearbyEstablishments.push(new EstablishmentDto(likedEstablishment));
    }
    return new NearbyEstablishmentsDto({
      nearbyEstablishments: nearbyEstablishments,
    });
  }
}
