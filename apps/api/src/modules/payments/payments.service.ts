import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: Implement Finik payment integration
  // TODO: Implement webhook handler for payment verification
  // TODO: Implement payment status tracking
}
