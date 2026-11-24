import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ForumStatus } from '@prisma/client';

@Injectable()
export class ForumsService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, locale: string = 'ru') {
    const forum = await this.prisma.forum.findUnique({
      where: { id },
      include: {
        translations: {
          where: { locale: locale as any },
        },
        categories: {
          where: { isActive: true },
          include: {
            translations: {
              where: { locale: locale as any },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!forum) {
      throw new NotFoundException('Forum not found');
    }

    // Calculate available tickets
    const soldTickets = await this.prisma.ticket.count({
      where: {
        forumId: id,
        status: { in: ['ACTIVE', 'USED'] },
      },
    });

    return {
      ...forum,
      availableTickets: forum.capacity - soldTickets,
      soldTickets,
    };
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    status?: ForumStatus;
    locale?: string;
  }) {
    const { skip, take, status, locale = 'ru' } = params;

    const where: Prisma.ForumWhereInput = {
      status: status || { in: ['PUBLISHED', 'SCHEDULED'] },
    };

    const [forums, total] = await Promise.all([
      this.prisma.forum.findMany({
        skip,
        take,
        where,
        include: {
          translations: {
            where: { locale: locale as any },
          },
          categories: {
            where: { isActive: true },
            include: {
              translations: {
                where: { locale: locale as any },
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { startsAt: 'asc' },
      }),
      this.prisma.forum.count({ where }),
    ]);

    // Add ticket availability info
    const forumsWithAvailability = await Promise.all(
      forums.map(async forum => {
        const soldTickets = await this.prisma.ticket.count({
          where: {
            forumId: forum.id,
            status: { in: ['ACTIVE', 'USED'] },
          },
        });

        return {
          ...forum,
          availableTickets: forum.capacity - soldTickets,
          soldTickets,
        };
      })
    );

    return {
      data: forumsWithAvailability,
      total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      pageSize: take || total,
    };
  }

  async create(data: Prisma.ForumCreateInput) {
    return this.prisma.forum.create({
      data,
      include: {
        translations: true,
        categories: {
          include: {
            translations: true,
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ForumUpdateInput) {
    return this.prisma.forum.update({
      where: { id },
      data,
      include: {
        translations: true,
        categories: {
          include: {
            translations: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.forum.delete({
      where: { id },
    });
  }
}
