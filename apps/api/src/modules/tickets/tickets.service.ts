import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string) {
    return this.prisma.ticket.findMany({
      where: { buyerId: userId },
      include: {
        forum: {
          include: {
            translations: {
              where: { locale: 'RU' },
            },
          },
        },
        orderItem: {
          include: {
            ticketCategory: {
              include: {
                translations: {
                  where: { locale: 'RU' },
                },
              },
            },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async findById(ticketId: string) {
    return this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        forum: {
          include: {
            translations: true,
          },
        },
        orderItem: {
          include: {
            ticketCategory: {
              include: {
                translations: true,
              },
            },
          },
        },
        checkIn: true,
      },
    });
  }

  // TODO: Implement QR token generation and encryption
  // TODO: Implement QR verification and check-in
  // TODO: Implement ticket cancellation
}
