import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { SetCookieInterceptor } from './set-cookie.interceptor';
import { Role } from '@prisma/client';

@Controller('auth')
@UseInterceptors(SetCookieInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
  ) {}

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string; role: Role },
  ) {
    const result = await this.authService.register(
      body.name,
      body.email,
      body.password,
      body.role,
    );

    return {
      ...result,
      setCookie: this.cookieService.createAuthCookie(result),
    };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const result = await this.authService.login(body.email, body.password);

    return {
      ...result,
      setCookie: this.cookieService.createAuthCookie(result),
    };
  }

  @Post('logout')
  async logout() {
    return {
      message: 'Logged out successfully',
      setCookie: this.cookieService.clearAuthCookie(),
    };
  }
}
