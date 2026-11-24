import { Locale, UserRole, UserStatus } from '../enums';

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  phoneVerifiedAt: Date | null;
  email: string | null;
  role: UserRole;
  status: UserStatus;
  preferredLocale: Locale;
  announcementsPushEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  role: UserRole;
  preferredLocale: Locale;
  phoneVerifiedAt: Date | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}
