import { Global, Module, Provider } from '@nestjs/common';
import { MINIO } from 'src/commons/constants';
import { MinioStorage } from 'src/commons/minio/minio';

const minioProvider: Provider = {
  provide: MINIO,
  useValue: new MinioStorage({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
    secretKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
  }),
};

@Global()
@Module({
  providers: [minioProvider],
  exports: [minioProvider],
})
export class MinioModule {}
