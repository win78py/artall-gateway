import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = await super.canActivate(context);
    const request = context.switchToHttp().getRequest();
    await new Promise<void>((resolve, reject) =>
      request.logIn(request.user, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }),
    );
    return activate as boolean;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
