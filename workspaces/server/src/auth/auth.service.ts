import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  verifyToken(token: string): any {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getUsername(accessToken: string): Promise<string> {
    const url = `${process.env.NEXT_PUBLIC_WS_API_AUTH_URL}/user/profile/`;

    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return response.data.username;
  }
}
