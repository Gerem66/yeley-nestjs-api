import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Inject,
  Param,
  ParseFilePipe,
  Post,
  Put,
  StreamableFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { CreateEstablishmentDto } from 'src/modules/establishments/dtos/create-establishment.dto';
import { EstablishmentDto } from 'src/modules/establishments/dtos/establishment.dto';
import { EstablishmentMapper } from 'src/modules/establishments/establishments.mapper';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DeletePicturesDto } from 'src/modules/establishments/dtos/delete-pictures.dto';
import { BucketType, MINIO } from 'src/commons/constants';
import { MinioStorage } from 'src/commons/minio/minio';

@ApiTags('Establishments')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('establishments')
export class EstablishmentsController {
  constructor(
    @Inject(MINIO) private minioStorage: MinioStorage,
    private readonly establishmentService: EstablishmentsService,
  ) {}

  @ApiOperation({ description: 'Create a new establishment' })
  @ApiResponse({ type: EstablishmentDto })
  @Post('create')
  async create(@Body() dto: CreateEstablishmentDto) {
    const establishment = await this.establishmentService.createEstablishment(
      dto,
    );
    return EstablishmentMapper.toEstablishmentDto(establishment);
  }

  @ApiOperation({
    description: 'Upload new establishment pictures',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Put(':id/add/pictures')
  @UseInterceptors(FilesInterceptor('files'))
  async updatedPictures(
    @Param('id') establishmentId: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/(jpeg|png|jpg)' }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<void> {
    await this.establishmentService.uploadPictures(establishmentId, files);
  }

  @ApiOperation({
    description: 'Delete establishment pictures',
  })
  @Delete(':id/delete/pictures')
  async deletePictures(
    @Param('id') establishmentId: string,
    @Body() dto: DeletePicturesDto,
  ): Promise<void> {
    const { picturesPaths } = dto;
    await this.establishmentService.deletePictures(
      establishmentId,
      picturesPaths,
    );
  }

  @ApiOperation({ description: 'Stream picture establishment' })
  @Get('/picture/:path')
  async getPicture(
    @Param('path') picturePath: string,
  ): Promise<StreamableFile> {
    const file = await this.minioStorage.download(
      picturePath,
      BucketType.establishments,
    );
    return new StreamableFile(file);
  }
}
