import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class DeletePicturesDto {
  @ApiProperty({ example: ['<uuid.png>', '<uuid.jpg>'] })
  @IsArray()
  @IsString({ each: true })
  picturesPaths: string[];
}
