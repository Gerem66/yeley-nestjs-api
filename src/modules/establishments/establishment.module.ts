import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstablishmentsController } from 'src/modules/establishments/establishments.controller';
import {
  Establishment,
  EstablishmentSchema,
} from 'src/modules/establishments/establishments.schema';
import { EstablishmentsService } from 'src/modules/establishments/establishments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Establishment.name, schema: EstablishmentSchema },
    ]),
  ],
  providers: [EstablishmentsService],
  controllers: [EstablishmentsController],
})
export class EstablishmentsModule {}
