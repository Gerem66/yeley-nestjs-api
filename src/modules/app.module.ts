import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { MinioModule } from 'src/modules/minio/minio.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { LegalitiesModule } from 'src/modules/legalities/legalities.module';
import { EstablishmentsModule } from 'src/modules/establishments/establishment.module';
import { TagsModule } from 'src/modules/tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MinioModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    UsersModule,
    AuthModule,
    LegalitiesModule,
    EstablishmentsModule,
    TagsModule,
  ],
})
export class AppModule {}

/**
 *
 * - prod:
 * - changer la config minio (url, etc..)
 * - stocker les crash en db
 */
