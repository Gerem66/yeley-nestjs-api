import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EstablishmentType } from 'src/commons/constants';
import { Tag } from 'src/modules/tags/tags.schema';

export type EstablishmentDocument = HydratedDocument<Establishment>;

@Schema()
export class Establishment {
  @Prop()
  name: string; // Paul Bakery

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }])
  tags: mongoose.Types.ObjectId[] | Tag[];

  @Prop()
  fullAddress: string; // 11 rue de la machine, Lyon

  @Prop({ type: Object })
  geolocation: {
    type: { type: string }; // Point
    coordinates: number[]; // 10.0943, 89.470129
  };

  @Prop({ default: [] })
  picturesPaths: [string]; // 6f610e66-d721-4e6b-bf52-c7252e619cc1, 02079223-2cff-4210-a895-4dc7e71adcbe

  @Prop({ default: 0 })
  likes: number; // 100

  @Prop()
  phone: string; // +339000000

  @Prop()
  type: EstablishmentType; // Restaurant

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ required: false })
  price: string;

  @Prop({ required: false })
  capacity: string;

  @Prop({ required: false })
  about: string;

  @Prop({ required: false })
  schedules: string;

  @Prop({ required: false })
  strongPoint: string;

  @Prop({ required: false })
  goodToKnow: string;

  @Prop({ required: false })
  forbiddenOnSite: string;
}

export const EstablishmentSchema = SchemaFactory.createForClass(Establishment);
