import { EstablishmentType } from 'src/commons/constants';
import { TagEntity } from 'src/modules/tags/tags.entity';

export class EstablishmentEntity {
  id: string;
  name: string;
  tags: TagEntity[];
  fullAddress: string;
  coordinates: number[];
  picturesPaths: string[];
  likes: number;
  phone: string;
  type: EstablishmentType;
  createdAt: Date;
  price: string | null;
  capacity: string | null;
  about: string | null;
  schedules: string | null;
  strongPoint: string | null;
  goodToKnow: string | null;
  forbiddenOnSite: string | null;

  constructor(parameters: Partial<EstablishmentEntity>) {
    this.id = parameters.id;
    this.name = parameters.name;
    this.tags = parameters.tags;
    this.fullAddress = parameters.fullAddress;
    this.coordinates = parameters.coordinates;
    this.picturesPaths = parameters.picturesPaths;
    this.likes = parameters.likes;
    this.phone = parameters.phone;
    this.type = parameters.type;
    this.createdAt = parameters.createdAt;

    this.price = parameters.price ?? null;
    this.capacity = parameters.capacity ?? null;
    this.about = parameters.about ?? null;
    this.schedules = parameters.schedules ?? null;
    this.strongPoint = parameters.strongPoint ?? null;
    this.goodToKnow = parameters.goodToKnow ?? null;
    this.forbiddenOnSite = parameters.forbiddenOnSite ?? null;
  }

  static fromJson(json: any): EstablishmentEntity | null {
    if (!json) {
      return null;
    }

    const establishment = new EstablishmentEntity({
      id: json._id,
      name: json.name,
      tags: TagEntity.fromJsons(json.tags),
      fullAddress: json.fullAddress,
      coordinates: json.geolocation ? json.geolocation.coordinates : [],
      picturesPaths: json.picturesPaths,
      likes: json.likes,
      phone: json.phone,
      type: json.type as EstablishmentType,
      createdAt: json.createdAt,
      price: json.price ?? null,
      capacity: json.capacity ?? null,
      about: json.about ?? null,
      schedules: json.schedules ?? null,
      strongPoint: json.strongPoint ?? null,
      goodToKnow: json.goodToKnow ?? null,
      forbiddenOnSite: json.forbiddenOnSite ?? null,
    });

    return establishment;
  }

  static fromJsons(jsons: any[]): EstablishmentEntity[] {
    if (!jsons) {
      return [];
    }

    const establishments: EstablishmentEntity[] = [];
    for (const json of jsons) {
      const establishment = EstablishmentEntity.fromJson(json);
      if (establishment) {
        establishments.push(establishment);
      }
    }
    return establishments;
  }
}
