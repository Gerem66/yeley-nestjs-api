import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EstablishmentType } from 'src/commons/constants';

export type TagDocument = HydratedDocument<Tag>;

@Schema()
export class Tag {
  @Prop()
  value: string;

  @Prop()
  type: EstablishmentType;

  @Prop()
  picturePath: string | null;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
