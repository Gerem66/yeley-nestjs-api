import { Injectable, UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/users/users.schema';
import { SignupDto } from 'src/modules/auth/dtos/signup.dto';
import { UserAlreadyExistException } from 'src/commons/errors/security/user-already-exist';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtContent } from 'src/commons/types/jwt-content';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { UserNotFoundException } from 'src/commons/errors/security/user-not-found';
import { InvalidPasswordException } from 'src/commons/errors/security/invalid-password';
import { EmailNotConfirmedException } from 'src/commons/errors/security/email-not-confirmed';
import { MailService } from 'src/modules/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async signup(user: SignupDto): Promise<{ message: string }> {
    const { email, password } = user;
    const dbUser = await this.userModel.findOne({ email });

    if (dbUser) {
      throw new UserAlreadyExistException();
    }

    const passwordHash = await argon2.hash(password);
    const confirmationToken = uuidv4();
    const confirmationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    const userCreated = await this.userModel.create({ 
      email, 
      passwordHash,
      isEmailConfirmed: false,
      confirmationToken,
      confirmationTokenExpires
    });

    await this.mailService.sendUserConfirmation(userCreated, confirmationToken);

    return { message: 'Un email de confirmation a été envoyé à votre adresse email. Veuillez confirmer votre compte pour vous connecter.' };
  }

  async login(user: LoginDto): Promise<{ accessToken: string, createdAt: Date }> {
    const { email, password } = user;
    const dbUser = await this.userModel.findOne({ email });

    if (!dbUser) {
      throw new UserNotFoundException();
    }

    const match = await argon2.verify(dbUser.passwordHash, password);
    if (!match) {
      throw new InvalidPasswordException();
    }

    // Vérifier si l'email a été confirmé
    if (!dbUser.isEmailConfirmed) {
      throw new EmailNotConfirmedException();
    }

    const accessToken = await this.jwtService.signAsync({
      id: dbUser._id.toString(),
    } as JwtContent);

    return { accessToken, createdAt: dbUser.createdAt };
  }

  async confirmEmail(token: string): Promise<void> {
    const user = await this.userModel.findOne({
      confirmationToken: token,
      confirmationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new UnauthorizedException('Le lien de confirmation est invalide ou a expiré.');
    }

    user.isEmailConfirmed = true;
    user.confirmationToken = null;
    user.confirmationTokenExpires = null;
    await user.save();
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;
    const user = await this.userModel.findOne({ email });

    // Même si l'utilisateur n'existe pas, on renvoie un message positif pour des raisons de sécurité
    if (!user || !user.isEmailConfirmed) {
      return { message: 'Si un compte existe avec cette adresse email, un lien de réinitialisation a été envoyé.' };
    }

    const resetPasswordToken = uuidv4();
    const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    await this.mailService.sendPasswordReset(user, resetPasswordToken);

    return { message: 'Un email contenant un lien de réinitialisation de mot de passe a été envoyé.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto;
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new UnauthorizedException('Le lien de réinitialisation est invalide ou a expiré.');
    }

    const passwordHash = await argon2.hash(password);

    user.passwordHash = passwordHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return { message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.' };
  }
}
