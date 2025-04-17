import {
  Controller,
  Get,
  Inject,
  StreamableFile,
  Header,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BucketType, MINIO } from 'src/commons/constants';
import { MinioStorage } from 'src/commons/minio/minio';

@ApiTags('Legalities')
@Controller('legalities')
export class LegalitiesController {
  constructor(@Inject(MINIO) private minioStorage: MinioStorage) {}

  @ApiOperation({ description: 'Stream terms of use document' })
  @Header('Content-type', 'application/pdf')
  @Get('/terms-of-use')
  async getTermsOfUse(): Promise<StreamableFile> {
    try {
      const file = await this.minioStorage.download(
        'terms-of-use.pdf',
        BucketType.legalities,
      );
      return new StreamableFile(file);
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        throw new NotFoundException('Le document des conditions d\'utilisation n\'est pas disponible');
      }
      throw error;
    }
  }

  @ApiOperation({ description: 'Stream privacy policy document' })
  @Header('Content-type', 'application/pdf')
  @Get('/privacy-policy')
  async getPrivacyPolicy(): Promise<StreamableFile> {
    try {
      const file = await this.minioStorage.download(
        'privacy-policy.pdf',
        BucketType.legalities,
      );
      return new StreamableFile(file);
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        throw new NotFoundException('Le document de politique de confidentialité n\'est pas disponible');
      }
      throw error;
    }
  }
}
