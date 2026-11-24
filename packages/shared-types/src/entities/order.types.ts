import { OrderStatus, PaymentStatus } from '../enums';
import { TicketCategory } from './forum.types';

export interface OrderItem {
  id: string;
  orderId: string;
  ticketCategoryId: string;
  participantFirstName: string;
  participantLastName: string;
  unitPriceMinor: number;
  createdAt: Date;
  ticketCategory?: TicketCategory;
  ticket?: {
    id: string;
    ticketNumber: string;
    status: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  forumId: string;
  status: OrderStatus;
  subtotalMinor: number;
  totalMinor: number;
  currency: string;
  reservedUntil: Date | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface CreateOrderData {
  forumId: string;
  items: {
    ticketCategoryId: string;
    participantFirstName: string;
    participantLastName: string;
  }[];
}

export interface OrderSummary {
  orderId: string;
  orderNumber: string;
  forumTitle: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  itemsCount: number;
  createdAt: Date;
}

export interface PaymentIntent {
  orderId: string;
  amount: number;
  currency: string;
  paymentUrl: string;
  expiresAt: Date;
}
