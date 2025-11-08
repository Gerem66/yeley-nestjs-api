import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { BucketType, MINIO } from 'src/commons/constants';
import { TagtNotFoundException } from 'src/commons/errors/security/tag-not-found';
import { MinioStorage } from 'src/commons/minio/minio';
import { CreateTagDto } from 'src/modules/tags/dtos/create-tag.dto';
import { TagEntity } from 'src/modules/tags/tags.entity';
import { Tag } from 'src/modules/tags/tags.schema';

@Injectable()
export class TagsService {
  constructor(
    @Inject(MINIO) private minioStorage: MinioStorage,
    @InjectModel(Tag.name)
    private tagsModel: mongoose.Model<Tag>,
  ) {}

  async getAll(): Promise<TagEntity[]> {
    const tags = await this.tagsModel.find();
    const tagEntities = TagEntity.fromJsons(tags);

    // Faire remonter les deux tags prioritaires en premier ("coup de coeur")
    const priorityIds = ['6560477ad6910673f298f92b', '65dfcf1696c32c675970ff95'];
    priorityIds.forEach(id => {
      const index = tagEntities.findIndex(tag => tag.id == id);
      if (index > 0) {
        const tag = tagEntities.splice(index, 1)[0];
        tagEntities.unshift(tag);
      }
    });

    return tagEntities;
  }

  async create(tag: CreateTagDto): Promise<TagEntity> {
    const createdTag = await this.tagsModel.create({
      value: tag.value,
      type: tag.type,
    });
    return TagEntity.fromJson(tag);
  }

  async delete(tagId: string): Promise<void> {
    await this.tagsModel.findByIdAndDelete(tagId);
    // TODO: Remove the attached picture.
  }

  async uploadPicture(tagId: string, file: Express.Multer.File): Promise<void> {
    const exist = await this.tagsModel.findById(tagId);
    if (!exist) {
      throw new TagtNotFoundException();
    }
    const path = await this.minioStorage.upload(file, BucketType.tags);
    await this.tagsModel.findByIdAndUpdate(tagId, { picturePath: path });
  }
}
