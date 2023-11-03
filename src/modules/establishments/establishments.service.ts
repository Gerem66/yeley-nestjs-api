import { Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Establishment } from './establishments.schema';
import { CreateEstablishmentDto } from 'src/modules/establishments/dtos/create-establishment.dto';
import { EstablishmentEntity } from 'src/modules/establishments/establishments.entity';
import { EstablishmentNotFoundException } from 'src/commons/errors/security/establishment-not-found';
import { MinioStorage } from 'src/commons/minio/minio';
import { BucketType, MINIO } from 'src/commons/constants';

@Injectable()
export class EstablishmentsService {
  constructor(
    @Inject(MINIO) private minioStorage: MinioStorage,
    @InjectModel(Establishment.name)
    private establishmentsModel: mongoose.Model<Establishment>,
  ) {}

  async createEstablishment(
    establishment: CreateEstablishmentDto,
  ): Promise<EstablishmentEntity> {
    const createdEstablishment = await this.establishmentsModel.create({
      name: establishment.name,
      tags: establishment.tags,
      fullAddress: establishment.fullAddress,
      phone: establishment.phone,
      type: establishment.type,
      geolocation: {
        type: 'Point',
        coordinates: establishment.coordinates,
      },
    });
    return EstablishmentEntity.fromJson(createdEstablishment);
  }

  async uploadPictures(
    establishmentId: string,
    files: Express.Multer.File[],
  ): Promise<void> {
    const exist = await this.establishmentsModel.findById(establishmentId);
    if (!exist) {
      throw new EstablishmentNotFoundException();
    }
    const uploadFilesPaths = [];
    for (const file of files) {
      const path = await this.minioStorage.upload(
        file,
        BucketType.establishment,
      );
      uploadFilesPaths.push(path);
    }
    await this.establishmentsModel.findByIdAndUpdate(establishmentId, {
      $push: { picturesPaths: { $each: uploadFilesPaths } },
    });
  }

  async deletePictures(
    establishmentId: string,
    picturesPaths: string[],
  ): Promise<void> {
    const exist = await this.establishmentsModel.findById(establishmentId);
    if (!exist) {
      throw new EstablishmentNotFoundException();
    }
    await this.establishmentsModel.findByIdAndUpdate(establishmentId, {
      $pull: { picturesPaths: { $in: picturesPaths } },
    });
    for (const picturePath of picturesPaths) {
      await this.minioStorage.remove(picturePath, BucketType.establishment);
    }
  }
}
