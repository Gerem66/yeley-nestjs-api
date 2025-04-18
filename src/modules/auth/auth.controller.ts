import { Controller, Post, Body, Get, Query, HttpCode, Res } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignupDto } from 'src/modules/auth/dtos/signup.dto';
import { LoggedDto } from 'src/modules/auth/dtos/logged.dto';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Create a new user account' })
  @ApiResponse({ 
    status: 201,
    description: 'Un email de confirmation a été envoyé à l\'adresse email indiquée.'
  })
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    return await this.authService.signup(dto);
  }

  @ApiOperation({ description: 'Login with an user account' })
  @ApiResponse({ type: LoggedDto })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { token, createdAt } = await this.authService.login(dto);
    return new LoggedDto(token, createdAt);
  }

  @ApiOperation({ description: 'Confirm user email address' })
  @ApiResponse({ 
    status: 200, 
    description: 'Email confirmé avec succès' 
  })
  @Get('confirm')
  async confirmEmail(@Query('token') token: string, @Res() res: Response) {
    try {
      await this.authService.confirmEmail(token);
      
      // Renvoyer une page HTML de confirmation au lieu d'une réponse JSON
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email confirmé - Yeley</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
                color: #333;
              }
              h1 {
                color: #2c3e50;
                margin-bottom: 20px;
              }
              .success-box {
                background-color: #dff0d8;
                border: 1px solid #d6e9c6;
                color: #3c763d;
                padding: 15px;
                border-radius: 4px;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                color: white;
                background-color: #3498db;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                margin-top: 20px;
              }
              .footer {
                margin-top: 30px;
                color: #7f8c8d;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <h1>Votre email a été confirmé</h1>
            <div class="success-box">
              Votre adresse email a été confirmée avec succès. Vous pouvez maintenant vous connecter à votre compte.
            </div>
            <p class="footer">© ${new Date().getFullYear()} Yeley. Tous droits réservés.</p>
          </body>
        </html>
      `);
    } catch (error) {
      // En cas d'erreur, afficher une page d'erreur
      res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erreur de confirmation - Yeley</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
                color: #333;
              }
              h1 {
                color: #2c3e50;
                margin-bottom: 20px;
              }
              .error-box {
                background-color: #f2dede;
                border: 1px solid #ebccd1;
                color: #a94442;
                padding: 15px;
                border-radius: 4px;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                color: white;
                background-color: #3498db;
                padding: 12px 20px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                margin-top: 20px;
              }
              .footer {
                margin-top: 30px;
                color: #7f8c8d;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <h1>Erreur de confirmation</h1>
            <div class="error-box">
              ${error.message || 'Le lien de confirmation est invalide ou a expiré.'}
            </div>
            <p class="footer">© ${new Date().getFullYear()} Yeley. Tous droits réservés.</p>
          </body>
        </html>
      `);
    }
  }
}
