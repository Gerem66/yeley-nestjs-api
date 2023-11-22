import { EstablishmentType } from 'src/commons/constants';

export class TagEntity {
  id: string;
  value: string;
  type: EstablishmentType;
  picturePath: string | null;
  createdAt: Date;

  constructor(parameters: TagEntity) {
    Object.assign(this, parameters);
  }

  static fromJson(json: any): TagEntity | null {
    if (!json) {
      return null;
    }

    const establishment = new TagEntity({
      id: json._id,
      value: json.value,
      type: EstablishmentType[json.type],
      picturePath: json.picturePath,
      createdAt: json.createdAt,
    });

    return establishment;
  }

  static fromJsons(jsons: any[]): TagEntity[] {
    if (!jsons) {
      return [];
    }

    const establishments: TagEntity[] = [];
    for (const json of jsons) {
      const establishment = TagEntity.fromJson(json);
      if (establishment) {
        establishments.push(establishment);
      }
    }
    return establishments;
  }
}
