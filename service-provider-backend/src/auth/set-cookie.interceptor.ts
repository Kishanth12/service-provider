import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data?.setCookie) {
          const response = context.switchToHttp().getResponse();
          const { name, value, options } = data.setCookie;
          response.cookie(name, value, options);
          delete data.setCookie; // Remove from response body
        }
        return data;
      }),
    );
  }
}
