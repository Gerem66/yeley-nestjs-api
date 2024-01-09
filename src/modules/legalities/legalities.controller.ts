import {
  Controller,
  Get,
  Inject,
  StreamableFile,
  Header,
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
    const file = await this.minioStorage.download(
      'terms-of-use.pdf',
      BucketType.legalities,
    );
    return new StreamableFile(file);
  }

  @ApiOperation({ description: 'Stream privacy policy document' })
  @Header('Content-type', 'application/pdf')
  @Get('/privacy-policy')
  async getPrivacyPolicy(): Promise<StreamableFile> {
    const file = await this.minioStorage.download(
      'privacy-policy.pdf',
      BucketType.legalities,
    );
    return new StreamableFile(file);
  }
}
