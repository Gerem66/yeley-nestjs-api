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
    const isPhone = await this.userModel.findOne({ email });

    if (isPhone) {
      throw new UserAlreadyExistException();
    }

    const passwordHash = await argon2.hash(password);
    const userCreated = await this.userModel.create({ email, passwordHash });
    return await this.jwtService.signAsync({
      id: userCreated._id.toString(),
    } as JwtContent);
  }

  async login(user: LoginDto): Promise<string> {
    const { email, password } = user;
    const existingUser = await this.userModel.findOne({ email });

    if (!existingUser) {
      throw new UserNotFoundException();
    }
    const match = await argon2.verify(existingUser.passwordHash, password);
    if (!match) {
      throw new InvalidPasswordException();
    }
    return await this.jwtService.signAsync({
      id: existingUser._id.toString(),
    } as JwtContent);
  }
}
