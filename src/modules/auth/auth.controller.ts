import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupDto } from 'src/modules/auth/dtos/signup.dto';
import { SignedDto } from 'src/modules/auth/dtos/signed.dto';
import { LoggedDto } from 'src/modules/auth/dtos/logged.dto';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Create a new user account' })
  @ApiResponse({ type: SignedDto })
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    const accessToken = await this.authService.signup(dto);
    return new SignedDto(accessToken);
  }

  @ApiOperation({ description: 'Login with an user account' })
  @ApiResponse({ type: LoggedDto })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const accessToken = await this.authService.login(dto);
    return new LoggedDto(accessToken);
  }
}
