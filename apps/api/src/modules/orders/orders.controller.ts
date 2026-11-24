import { Controller, Get, Post, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  async getUserOrders(
    @Req() req: any,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20
  ) {
    const skip = (page - 1) * pageSize;

    return this.ordersService.findByUser(req.user.id, {
      skip,
      take: pageSize,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async getOrderById(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.findById(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  async createOrder(@Req() req: any) {
    // TODO: Implement order creation
    return {
      message: 'Order creation will be implemented',
    };
  }
}
