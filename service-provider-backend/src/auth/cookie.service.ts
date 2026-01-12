import { Injectable } from '@nestjs/common';

@Injectable()
export class CookieService {
  private readonly COOKIE_NAME = 'auth-storage';
  private readonly MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

  createAuthCookie(userData: any) {
    const authData = {
      state: {
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        },
        accessToken: userData.access_token,
        isAuthenticated: true,
      },
    };

    return {
      name: this.COOKIE_NAME,
      value: JSON.stringify(authData),
      options: {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: this.MAX_AGE,
        path: '/',
      },
    };
  }

  clearAuthCookie() {
    return {
      name: this.COOKIE_NAME,
      value: '',
      options: {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 0,
        path: '/',
      },
    };
  }
}
