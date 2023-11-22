import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/commons/guards/auth.guard';
import { IdFromJWT } from 'src/commons/decorators/id-from-jwt.decorator';
import { LikedEstablishmentsDto } from 'src/modules/users/dtos/liked-establishments.dto';
import { UserMapper } from 'src/modules/users/user.mapper';
import { NearbyEstablishmentsDto } from 'src/modules/users/dtos/nearby-establishments.dto';
import { GetNearbyEstablishmentsDto } from 'src/modules/users/dtos/get-nearby-establishments.dto';

@ApiTags('Users')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ description: 'Delete (anonymise) a user account' })
  @Delete()
  async delete(@IdFromJWT() userId: string) {
    await this.userService.delete(userId);
  }

  @ApiOperation({ description: 'Add to the liked establishment list' })
  @Get('/like/establishment/:id')
  async likeEstablishment(
    @Param('id') establishmentId: string,
    @IdFromJWT() userId: string,
  ) {
    await this.userService.likeEstablishment(userId, establishmentId);
  }

  @ApiOperation({ description: 'Add to the liked establishment list' })
  @Get('/unlike/establishment/:id')
  async unlikeEstablishment(
    @Param('id') establishmentId: string,
    @IdFromJWT() userId: string,
  ) {
    await this.userService.unlikeEstablishment(userId, establishmentId);
  }

  @ApiOperation({ description: 'Add to the liked establishment list' })
  @Get('/liked/establishments')
  async getlikedEstablishments(
    @IdFromJWT() userId: string,
  ): Promise<LikedEstablishmentsDto> {
    const establishments = await this.userService.getLikedEstablishments(
      userId,
    );
    return UserMapper.toLikedEstablishmentsDto(establishments);
  }

  @ApiOperation({ description: 'Get nearby establishments matching filters' })
  @Post('/nearby/establishments')
  async getNearbyEstablishments(
    @Body() dto: GetNearbyEstablishmentsDto,
    @IdFromJWT() userId: string,
    @Query('liked') liked: string | null,
  ): Promise<NearbyEstablishmentsDto> {
    const { coordinates, range, type, tags } = dto;
    const nearbyEstablishments = await this.userService.getNearbyEstablishments(
      userId,
      coordinates,
      range,
      type,
      tags,
      liked,
    );
    return new NearbyEstablishmentsDto({
      nearbyEstablishments: nearbyEstablishments,
    });
  }
}
