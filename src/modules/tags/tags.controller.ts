import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Put,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BucketType, MINIO } from 'src/commons/constants';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { MinioStorage } from 'src/commons/minio/minio';
import { AllTagsDto } from 'src/modules/tags/dtos/all-tags.dto';
import { CreateTagDto } from 'src/modules/tags/dtos/create-tag.dto';
import { TagDto } from 'src/modules/tags/dtos/tag.dto';
import { TagsMapper } from 'src/modules/tags/tags.mapper';

import { TagsService } from 'src/modules/tags/tags.service';

@ApiTags('Tags')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('tags')
export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
    @Inject(MINIO) private minioStorage: MinioStorage,
  ) {}

  @ApiOperation({ description: 'Get all tags' })
  @Get('/all')
  async getAll(): Promise<AllTagsDto> {
    const tags = await this.tagsService.getAll();
    return TagsMapper.toAllTagsDto(tags);
  }

  @ApiOperation({ description: 'Create a tag' })
  @Post('/create')
  async create(@Body() dto: CreateTagDto): Promise<TagDto> {
    const tag = await this.tagsService.create(dto);
    return TagsMapper.toTagDto(tag);
  }

  @ApiOperation({ description: 'Delete a tag' })
  @Delete('/:id')
  async delete(@Param('id') tagId: string): Promise<void> {
    await this.tagsService.delete(tagId);
  }

  @ApiOperation({
    description: 'Upload new tag picture',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Put(':id/add/pictures')
  @UseInterceptors(FileInterceptor('file'))
  async updatedPictures(
    @Param('id') establishmentId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/(jpeg|png|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    await this.tagsService.uploadPicture(establishmentId, file);
  }

  @ApiOperation({ description: 'Stream tag picture' })
  @Get('/picture/:path')
  async getPicture(
    @Param('path') picturePath: string,
  ): Promise<StreamableFile> {
    try {
      const file = await this.minioStorage.download(picturePath, BucketType.tags);
      return new StreamableFile(file);
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        throw new NotFoundException(`Image avec chemin ${picturePath} non trouvée`);
      }
      throw error;
    }
  }
}
