import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AccountStatus } from 'src/commons/constants';
import * as mongoose from 'mongoose';
import { Establishment } from 'src/modules/establishments/establishments.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  passwordHash: string;

  @Prop({ default: AccountStatus.active })
  accountStatus: AccountStatus;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Establishment',
    default: [],
  })
  likedEstablishments: [mongoose.Types.ObjectId | Establishment];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Establishment',
    default: [],
  })
  unlikedEstablishments: [mongoose.Types.ObjectId | Establishment];

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
