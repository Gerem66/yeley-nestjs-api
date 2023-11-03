import { Module } from '@nestjs/common';
import { LegalitiesController } from 'src/modules/legalities/legalities.controller';

@Module({
  controllers: [LegalitiesController],
})
export class LegalitiesModule {}
