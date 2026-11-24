import { z } from 'zod';

// Phone number validation (E.164 format)
export const phoneSchema = z
  .string()
  .regex(/^\+[0-9]{10,15}$/, 'Phone must be in E.164 format (e.g., +996700123456)');

// Email validation
export const emailSchema = z.string().email('Invalid email address').toLowerCase();

// OTP code validation
export const otpCodeSchema = z.string().length(6, 'OTP code must be 6 digits').regex(/^\d{6}$/);

// Send OTP DTO
export const sendOtpSchema = z.object({
  phone: phoneSchema,
  purpose: z.enum(['LOGIN', 'VERIFY_PHONE', 'CHANGE_PHONE']),
});

export type SendOtpDto = z.infer<typeof sendOtpSchema>;

// Verify OTP DTO
export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: otpCodeSchema,
  purpose: z.enum(['LOGIN', 'VERIFY_PHONE', 'CHANGE_PHONE']),
});

export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;

// Complete Profile DTO
export const completeProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: emailSchema.optional(),
  preferredLocale: z.enum(['RU', 'KY', 'EN']).optional(),
});

export type CompleteProfileDto = z.infer<typeof completeProfileSchema>;

// Update Profile DTO
export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: emailSchema.optional(),
  preferredLocale: z.enum(['RU', 'KY', 'EN']).optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
