import { EstablishmentDto } from 'src/modules/establishments/dtos/establishment.dto';
import { EstablishmentEntity } from 'src/modules/establishments/establishments.entity';
import { TagDto } from 'src/modules/tags/dtos/tag.dto';

export class EstablishmentMapper {
  static toEstablishmentDto(entity: EstablishmentEntity): EstablishmentDto {
    const tags: TagDto[] = [];
    for (const tag of entity.tags) {
      tags.push(new TagDto(tag));
    }

    return new EstablishmentDto({
      id: entity.id,
      name: entity.name,
      tags: tags,
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
