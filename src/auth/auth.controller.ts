import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @ApiOperation({ summary: 'Issue a JWT for testing (no users)' })
  @ApiQuery({
    name: 'role',
    required: false,
    type: String,
    example: 'admin',
    description:
      'Role for the token payload. Defaults to "admin" if not provided.',
    schema: { default: 'admin' },
  })
  @Get('token')
  getToken(@Query('role') role?: string) {
    return this.auth.issueToken({ role });
  }
}
