import { EstablishmentDto } from 'src/modules/establishments/dtos/establishment.dto';
import { EstablishmentEntity } from 'src/modules/establishments/establishments.entity';

export class EstablishmentMapper {
  static toEstablishmentDto(entity: EstablishmentEntity): EstablishmentDto {
    return new EstablishmentDto({
      id: entity.id,
      name: entity.name,
      tags: entity.tags,
      fullAddress: entity.fullAddress,
      coordinates: entity.coordinates,
      picturesPaths: entity.picturesPaths,
      likes: entity.likes,
      phone: entity.phone,
      type: entity.type,
      createdAt: entity.createdAt,
    });
  }
}
