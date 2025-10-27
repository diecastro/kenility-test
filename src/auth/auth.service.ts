import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  async issueToken(payload: { sub?: string; role?: string } = {}) {
    const token = await this.jwt.signAsync({
      sub: payload.sub || 'system',
      role: payload.role || 'admin',
    });
    return { token: token };
  }
}
