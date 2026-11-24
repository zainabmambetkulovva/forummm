import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ForumsService } from './forums.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('forums')
@Controller('forums')
export class ForumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published forums' })
  @ApiResponse({ status: 200, description: 'List of forums' })
  async getAllForums(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
    @Query('locale') locale: string = 'ru'
  ) {
    const skip = (page - 1) * pageSize;

    return this.forumsService.findAll({
      skip,
      take: pageSize,
      locale,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get forum by ID' })
  @ApiResponse({ status: 200, description: 'Forum details' })
  async getForumById(@Param('id') id: string, @Query('locale') locale: string = 'ru') {
    return this.forumsService.findById(id, locale);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new forum (Admin only)' })
  @ApiResponse({ status: 201, description: 'Forum created successfully' })
  async createForum(@Req() req: any, @Body() createData: any) {
    // TODO: Add proper DTO validation
    return this.forumsService.create({
      ...createData,
      createdBy: {
        connect: { id: req.user.id },
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update forum (Admin only)' })
  @ApiResponse({ status: 200, description: 'Forum updated successfully' })
  async updateForum(@Param('id') id: string, @Body() updateData: any) {
    // TODO: Add proper DTO validation
    return this.forumsService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete forum (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Forum deleted successfully' })
  async deleteForum(@Param('id') id: string) {
    return this.forumsService.delete(id);
  }
}
