import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string, params: { skip?: number; take?: number }) {
    const { skip, take } = params;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take,
        include: {
          forum: {
            include: {
              translations: {
                where: { locale: 'RU' },
              },
            },
          },
          items: {
            include: {
              ticketCategory: {
                include: {
                  translations: {
                    where: { locale: 'RU' },
                  },
                },
              },
              ticket: true,
            },
          },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);

    return {
      data: orders,
      total,
    };
  }

  async findById(orderId: string, userId?: string) {
    const where: any = { id: orderId };
    if (userId) {
      where.userId = userId;
    }

    return this.prisma.order.findUnique({
      where,
      include: {
        forum: {
          include: {
            translations: true,
          },
        },
        items: {
          include: {
            ticketCategory: {
              include: {
                translations: true,
              },
            },
            ticket: true,
          },
        },
        payments: true,
      },
    });
  }

  // TODO: Implement order creation with inventory reservation
  // TODO: Implement payment verification
  // TODO: Implement ticket issuance after payment
}
