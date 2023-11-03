import { Client, ClientOptions } from 'minio';
import * as path from 'path';
import { BucketType } from 'src/commons/constants';
import internal from 'stream';
import { v4 as uuidv4 } from 'uuid';

export class MinioStorage extends Client {
  constructor(options: ClientOptions) {
    super(options);
  }

  /**
   * @param bucket  bucket where is stored the file
   * @returns the stored file name
   */
  async upload(file: Express.Multer.File, bucket: BucketType): Promise<string> {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    await this.putObject(bucket, fileName, file.buffer, file.size);
    return fileName;
  }

  /**
   * Remove file from [bucket]
   * @param fileName the file name
   * @param bucket  bucket where is stored the file
   */
  async remove(fileName: string, bucket: BucketType): Promise<void> {
    await this.removeObject(bucket, fileName);
  }

  /**
   * @param fileName the file name
   * @param bucket  bucket where is stored the file
   * @returns the readable file
   */
  async download(
    fileName: string,
    bucket: BucketType,
  ): Promise<internal.Readable> {
    return await this.getObject(bucket, fileName);
  }
}
