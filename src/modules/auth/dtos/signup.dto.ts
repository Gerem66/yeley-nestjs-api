import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    example: 'myemail@gmail.com',
    description: 'User email',
  })
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'rdH4Wxv$Oj6@Cw8#Z!RlVoClXxR78^D',
    description: 'User account password',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string;
}
