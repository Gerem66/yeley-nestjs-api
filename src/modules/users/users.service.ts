import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { AccountStatus, EstablishmentType } from 'src/commons/constants';
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

    // Vérifier si l'établissement est dans les likedEstablishments de l'utilisateur
    const user = await this.userModel.findById(userId);
    const isLiked = user.likedEstablishments.includes(establishmentId as unknown as Establishment);

    // S'il est dans les likedEstablishments, le retirer et décrémenter le compteur de likes
    if (isLiked) {
      await this.userModel.findByIdAndUpdate(userId, {
        $pull: { likedEstablishments: establishmentId },
      });

      await this.establishmentsModel.findByIdAndUpdate(establishmentId, {
        $inc: { likes: -1 },
      });
    }
  }

  async dislikeEstablishment(
    userId: string, 
    establishmentId: string,
  ): Promise<void> {
    const exist = await this.establishmentsModel.findById(establishmentId);
    if (!exist) {
      throw new EstablishmentNotFoundException();
    }

    // Ajouter l'établissement à la liste des établissements dislikés
    await this.userModel.findByIdAndUpdate(userId, {
      $addToSet: { unlikedEstablishments: establishmentId },
    });
  }

  async getLikedEstablishments(userId: string): Promise<EstablishmentEntity[]> {
    const user = await this.userModel
      .findById(userId)
      .populate('likedEstablishments');
    await user.populate('likedEstablishments.tags');
    return EstablishmentEntity.fromJsons(user.likedEstablishments);
  }

  async getNearbyEstablishments(
    userId: string,
    coordinates: number[],
    range: number,
    type: EstablishmentType,
    tags: string[],
    liked: string,
  ): Promise<EstablishmentEntity[]> {
    const user = await this.userModel.findById(userId);
    const { likedEstablishments, unlikedEstablishments } = user;

    const query: any = {
      type,
      geolocation: {
        $near: {
          // ! Coordinates are [Long, Lat] !
          $geometry: { type: 'Point', coordinates: coordinates },
          // KM converted to Meters.
          $maxDistance: range * 1000,
        },
      },
    };

    if (tags.length > 0) {
      query.tags = {
        $elemMatch: {
          $in: tags,
        },
      };
    }

    // Search in favorites
    if (liked === 'true') {
      query._id = {
        $in: likedEstablishments,
      };
    } else {
      // Or in all establishments not liked/disliked yet.
      query._id = {
        // Liked or unliked establishments are excluded.
        $nin: likedEstablishments.concat(unlikedEstablishments),
      };
    }

    const establishments = await this.establishmentsModel
      .find(query)
      .populate('tags');
    return EstablishmentEntity.fromJsons(establishments);
  }
}
