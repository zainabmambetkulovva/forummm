import { Controller, Get, Post, Param, UseGuards, Req, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user tickets' })
  async getUserTickets(@Req() req: any) {
    return this.ticketsService.findByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  async getTicketById(@Param('id') id: string) {
    return this.ticketsService.findById(id);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify QR ticket for check-in' })
  async verifyTicket(@Param('id') id: string, @Body() body: { qrToken: string }) {
    // TODO: Implement QR verification
    return {
      valid: true,
      message: 'Ticket verification will be implemented',
    };
  }
}
