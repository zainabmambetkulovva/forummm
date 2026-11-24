import { z } from 'zod';

// Common validation helpers
export const validatePhone = (phone: string): boolean => {
  return /^\+[0-9]{10,15}$/.test(phone);
};

export const validateEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

export const normalizePhone = (phone: string): string => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Ensure it starts with +
  if (!cleaned.startsWith('+')) {
    // Assume Kyrgyzstan if no country code
    return '+996' + cleaned;
  }

  return cleaned;
};

export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const formatPrice = (amountMinor: number, currency: string = 'KGS'): string => {
  const amount = amountMinor / 100;
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date | string, locale: string = 'ru'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const formatDateTime = (date: Date | string, locale: string = 'ru'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

// Pagination helpers
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const calculatePagination = (
  total: number,
  page: number,
  pageSize: number
): PaginatedResponse<any> => {
  return {
    data: [],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: any;
}
