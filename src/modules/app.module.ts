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
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 30000, // Augmenter le délai d'attente pour la sélection du serveur
      socketTimeoutMS: 60000, // Augmenter le délai d'attente pour les opérations socket
      connectTimeoutMS: 30000, // Augmenter le délai de connexion
      retryAttempts: 10, // Nombre maximal de tentatives de reconnexion
      retryDelay: 5000, // Délai entre les tentatives de reconnexion (5 secondes)
      heartbeatFrequencyMS: 10000, // Vérifier l'état de la connexion toutes les 10 secondes
      family: 4, // Forcer IPv4
    }),
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
