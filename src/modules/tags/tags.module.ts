import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsController } from 'src/modules/tags/tags.controller';
import { Tag, TagSchema } from 'src/modules/tags/tags.schema';
import { TagsService } from 'src/modules/tags/tags.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }])],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}
