import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST', 'smtp.example.com'),
          port: configService.get('MAIL_PORT', 587),
          secure: false,
          auth: {
            user: configService.get('MAIL_USER', 'user'),
            pass: configService.get('MAIL_PASSWORD', 'password'),
          },
          tls: {
            // Désactive la vérification stricte du certificat pour résoudre le problème de mismatch entre mail.yeley.fr et le certificat
            rejectUnauthorized: false
          },
        },
        defaults: {
          from: `"Yeley" <${configService.get('MAIL_FROM', 'noreply@yeley.com')}>`,
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
