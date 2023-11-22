import { ApiProperty } from '@nestjs/swagger';
import { TagDto } from 'src/modules/tags/dtos/tag.dto';

export class AllTagsDto {
  constructor(parameters: AllTagsDto) {
    Object.assign(this, parameters);
  }

  @ApiProperty({ isArray: true })
  tags: TagDto[];
}
