import { ForumStatus, Locale } from '../enums';

export interface ForumTranslation {
  id: string;
  locale: Locale;
  title: string;
  shortDescription: string | null;
  description: string | null;
  program: string | null;
}

export interface TicketCategoryTranslation {
  id: string;
  locale: Locale;
  name: string;
  description: string | null;
}

export interface TicketCategory {
  id: string;
  forumId: string;
  code: string;
  priceMinor: number;
  currency: string;
  capacity: number | null;
  isActive: boolean;
  sortOrder: number;
  translations: TicketCategoryTranslation[];
}

export interface Forum {
  id: string;
  slug: string;
  status: ForumStatus;
  bannerUrl: string | null;
  venueName: string | null;
  venueAddress: string | null;
  timeZone: string;
  startsAt: Date;
  endsAt: Date | null;
  qrExpiresAt: Date;
  capacity: number;
  maxTicketsPerAccount: number;
  publishAt: Date | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  translations: ForumTranslation[];
  categories: TicketCategory[];
}

export interface ForumListItem {
  id: string;
  slug: string;
  status: ForumStatus;
  bannerUrl: string | null;
  venueName: string | null;
  startsAt: Date;
  capacity: number;
  availableTickets: number;
  soldTickets: number;
  translations: ForumTranslation[];
  categories: TicketCategory[];
}

export interface ForumAvailability {
  forumId: string;
  totalCapacity: number;
  soldTickets: number;
  availableTickets: number;
  isSoldOut: boolean;
  categories: {
    categoryId: string;
    capacity: number | null;
    soldTickets: number;
    available: number;
    isSoldOut: boolean;
  }[];
}
