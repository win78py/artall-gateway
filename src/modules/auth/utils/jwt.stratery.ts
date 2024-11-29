import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'asiodasjoddjdoasddasoidjasiodasdjaiodd',
    });
  }

  async validate(payload: any) {
    console.log(payload);
    return this.authService.validateUserFromToken(payload);
  }

  static async getUserIdFromToken(token: string): Promise<string | null> {
    try {
      const jwtOptions: JwtModuleOptions = {
        global: true,
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '2h' },
      };

      const jwtService = new JwtService(jwtOptions);
      const decodedToken = jwtService.verify(token);
      console.log(decodedToken);

      return decodedToken.sub;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
