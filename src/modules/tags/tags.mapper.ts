import { AllTagsDto } from 'src/modules/tags/dtos/all-tags.dto';
import { TagDto } from 'src/modules/tags/dtos/tag.dto';
import { TagEntity } from 'src/modules/tags/tags.entity';

export class TagsMapper {
  static toAllTagsDto(entities: TagEntity[]): AllTagsDto {
    const tags: TagDto[] = [];
    for (const tag of entities) {
      tags.push(new TagDto(tag));
    }
    return new AllTagsDto({
      tags: tags,
    });
  }

  static toTagDto(entity: TagEntity): TagDto {
    return new TagDto({
      value: entity.value,
      type: entity.type,
      id: entity.id,
      picturePath: entity.picturePath,
      createdAt: entity.createdAt,
    });
  }
}
