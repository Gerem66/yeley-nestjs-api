import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { AccountStatus, EstablishmentType, Tags } from 'src/commons/constants';
import { Establishment } from 'src/modules/establishments/establishments.schema';
import { EstablishmentNotFoundException } from 'src/commons/errors/security/establishment-not-found';
import { EstablishmentEntity } from 'src/modules/establishments/establishments.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    @InjectModel(Establishment.name)
    private establishmentsModel: mongoose.Model<Establishment>,
  ) {}

  async delete(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      email: null,
      passwordHash: null,
      accountStatus: AccountStatus.deleted,
    });
  }

  async likeEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<void> {
    const exist = await this.establishmentsModel.findById(establishmentId);
    if (!exist) {
      throw new EstablishmentNotFoundException();
    }

    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { likedEstablishments: establishmentId },
    });

    await this.establishmentsModel.findByIdAndUpdate(establishmentId, {
      $inc: { likes: 1 },
    });
  }

  async unlikeEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<void> {
    const exist = await this.establishmentsModel.findById(establishmentId);
    if (!exist) {
      throw new EstablishmentNotFoundException();
    }

    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { unlikedEstablishments: establishmentId },
    });
  }

  async getLikedEstablishments(userId: string): Promise<EstablishmentEntity[]> {
    const user = await this.userModel
      .findById(userId)
      .populate('likedEstablishments');
    return EstablishmentEntity.fromJsons(user.likedEstablishments);
  }

  async getNearbyEstablishments(
    userId: string,
    coordinates: number[],
    range: number,
    type: EstablishmentType,
    tags: Tags[],
  ): Promise<EstablishmentEntity[]> {
    const user = await this.userModel.findById(userId);
    const { likedEstablishments, unlikedEstablishments } = user;

    const establishments = await this.establishmentsModel.find({
      type,
      _id: {
        // Liked or unliked establishments are excluded.
        $nin: likedEstablishments.concat(unlikedEstablishments),
      },
      tags: {
        $elemMatch: {
          $in: tags.length === 0 ? Object.values(Tags) : tags,
        },
      },
      geolocation: {
        $near: {
          // ! Coordinates are [Long, Lat] !
          $geometry: { type: 'Point', coordinates: coordinates },
          // KM converted to Meters.
          $maxDistance: range * 1000,
        },
      },
    });
    return EstablishmentEntity.fromJsons(establishments);
  }
}
