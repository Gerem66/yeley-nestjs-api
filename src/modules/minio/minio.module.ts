import { Global, Module, Provider } from '@nestjs/common';
import { MINIO } from 'src/commons/constants';
import { MinioStorage } from 'src/commons/minio/minio';

const minioProvider: Provider = {
  provide: MINIO,
  useValue: new MinioStorage({
    endPoint: 'minio',
    port: 9000,
    useSSL: process.env.MINIO_SCHEME === 'https',
    accessKey: process.env.MINIO_ACCESS_KEY ?? 'minio-root-user',
    secretKey: process.env.MINIO_SECRET_KEY ?? 'minio-root-password',
  }),
};

@Global()
@Module({
  providers: [minioProvider],
  exports: [minioProvider],
})
export class MinioModule {}
