import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {
    // const isProduction = process.env.NODE_ENV === 'production';
    // super({
    //   clientID:
    //     '49563416578-dqlkps203264qcsg5l9ruc05s3amp7m1.apps.googleusercontent.com',
    //   clientSecret: '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',
    //   callbackURL: isProduction
    //     ? 'https://api-orderus-871aeb23e2923.herokuapp.com/api/auth/google/redirect'
    //     : 'http://localhost:5000/api/auth/google/callback',
    //   scope: ['profile', 'email'],
    // });
    super({
      clientID:
        '49563416578-dqlkps203264qcsg5l9ruc05s3amp7m1.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      const user = await this.authService.validateUserFromGoogle(profile);

      const payload = {
        sub: user.id,
        email: user.email,
        displayName: user.fullName,
        role: user.role,
      };

      const token = this.jwtService.sign(payload);
      const redirectURL = `http://localhost:5173/login?token=${token}`;
      console.log(payload);
      console.log(token);
      return { accessToken: token, redirectURL };
    } catch (error) {
      throw error;
    }
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
