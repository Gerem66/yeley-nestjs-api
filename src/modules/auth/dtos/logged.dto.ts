import { IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoggedDto {
  constructor(accessToken: string, createdAt: Date) {
    this.accessToken = accessToken;
    this.createdAt = createdAt;
  }

  @ApiProperty({ example: '<token>', description: 'JWT token' })
  @IsString()
  readonly accessToken: string;

  @ApiProperty({ example: '2025-04-17T00:00:00.000Z', description: "Date d'inscription de l'utilisateur" })
  @IsDate()
  readonly createdAt: Date;
}
