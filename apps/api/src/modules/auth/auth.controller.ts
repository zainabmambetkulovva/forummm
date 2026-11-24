import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('phone/send-otp')
  @ApiOperation({ summary: 'Send OTP code to phone number' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  async sendOtp(@Body() body: { phone: string; purpose: string }) {
    // TODO: Implement OTP sending
    return {
      success: true,
      message: 'OTP sent to phone number',
      expiresIn: 300, // 5 minutes
    };
  }

  @Post('phone/verify-otp')
  @ApiOperation({ summary: 'Verify OTP code and login/register' })
  @ApiResponse({ status: 200, description: 'OTP verified, user authenticated' })
  async verifyOtp(@Body() body: { phone: string; code: string }) {
    // TODO: Implement OTP verification and JWT token generation
    return {
      success: true,
      accessToken: 'jwt-token-here',
      user: {
        id: 'user-id',
        phone: body.phone,
      },
    };
  }

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  async googleAuth() {
    // Handled by Google Strategy
    return { url: '/auth/google/callback' };
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthCallback(@Req() req: any) {
    // TODO: Implement Google OAuth callback
    return {
      success: true,
      message: 'Google authentication successful',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user data' })
  async getCurrentUser(@Req() req: any) {
    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  async logout() {
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
