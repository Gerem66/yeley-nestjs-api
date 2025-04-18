import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../users/users.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    // Nous utilisons directement l'URL de l'API pour la confirmation
    // Cela va rediriger l'utilisateur vers une page de succès après confirmation
    const confirmUrl = `${process.env.API_URL || 'https://api.yeley.fr'}/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Bienvenue sur Yeley ! Confirmez votre compte',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">Bienvenue sur Yeley !</h1>
          <p>Bonjour,</p>
          <p>Merci de vous être inscrit(e) sur Yeley. Pour finaliser votre inscription, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="background-color: #3498db; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirmer mon compte</a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez également cliquer sur le lien suivant ou le copier dans votre navigateur :</p>
          <p><a href="${confirmUrl}">${confirmUrl}</a></p>
          <p>Ce lien expirera dans 24 heures.</p>
          <p>Si vous n'avez pas créé de compte sur Yeley, vous pouvez ignorer cet email.</p>
          <p style="margin-top: 30px; color: #7f8c8d; font-size: 12px;">
            © ${new Date().getFullYear()} Yeley. Tous droits réservés.
          </p>
        </div>
      `,
    });
  }

  async sendPasswordReset(user: User, token: string) {
    const resetUrl = `${process.env.API_URL || 'https://api.yeley.fr'}/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe Yeley',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2c3e50;">Réinitialisation de mot de passe</h1>
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Réinitialiser mon mot de passe</a>
          </div>
          <p>Si le bouton ne fonctionne pas, vous pouvez également cliquer sur le lien suivant ou le copier dans votre navigateur :</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Ce lien expirera dans 1 heure.</p>
          <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet email.</p>
          <p style="margin-top: 30px; color: #7f8c8d; font-size: 12px;">
            © ${new Date().getFullYear()} Yeley. Tous droits réservés.
          </p>
        </div>
      `,
    });
  }
}