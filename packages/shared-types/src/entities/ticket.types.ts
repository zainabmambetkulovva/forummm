import { TicketStatus, CheckInMethod } from '../enums';

export interface Ticket {
  id: string;
  ticketNumber: string;
  orderItemId: string;
  forumId: string;
  buyerId: string;
  status: TicketStatus;
  qrTokenHash: string;
  issuedAt: Date;
  expiresAt: Date;
  usedAt: Date | null;
  cancelledAt: Date | null;
}

export interface TicketDetails extends Ticket {
  forum: {
    id: string;
    title: string;
    startsAt: Date;
    venueName: string | null;
    venueAddress: string | null;
  };
  category: {
    id: string;
    name: string;
    code: string;
  };
  participant: {
    firstName: string;
    lastName: string;
  };
  checkIn?: {
    id: string;
    checkedInAt: Date;
    method: CheckInMethod;
  };
}

export interface QRTicketData {
  ticketId: string;
  ticketNumber: string;
  token: string;
}

export interface TicketVerificationResult {
  valid: boolean;
  ticket?: TicketDetails;
  error?: string;
  reason?: string;
}
