import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pass, salt);
      const isMatch = await bcrypt.compare(pass, hash);
      if (!isMatch) {
        throw new UnauthorizedException();
      }

      const expiresIn = 60 * 60 * 24;

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + expiresIn,
      };

      return {
        access_token: await this.jwtService.signAsync(payload, {
          secret: process.env.SECRET,
        }),
        user: user,
      };
    } catch (e) {
      console.log('error---->', e);
    }
  }
}
