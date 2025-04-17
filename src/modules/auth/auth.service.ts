import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: mongoose.Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(user: SignupDto): Promise<string> {
    const { email, password } = user;
    const dbUser = await this.userModel.findOne({ email });

    if (dbUser) {
      throw new UserAlreadyExistException();
    }

    const passwordHash = await argon2.hash(password);
    const userCreated = await this.userModel.create({ email, passwordHash });
    return await this.jwtService.signAsync({
      id: userCreated._id.toString(),
    } as JwtContent);
  }

  async login(user: LoginDto): Promise<{ token: string, createdAt: Date }> {
    const { email, password } = user;
    const dbUser = await this.userModel.findOne({ email });

    if (!dbUser) {
      throw new UserNotFoundException();
    }
    const match = await argon2.verify(dbUser.passwordHash, password);
    if (!match) {
      throw new InvalidPasswordException();
    }
    const token = await this.jwtService.signAsync({
      id: dbUser._id.toString(),
    } as JwtContent);

    return { token, createdAt: dbUser.createdAt };
  }
}
