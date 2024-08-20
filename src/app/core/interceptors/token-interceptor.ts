import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  readonly #authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.#authService.getToken();

    if (!token || this.#authService.isTokenExpired()) {
      this.#authService.logout();
      return next.handle(req);
    }

    this.#authService.setCurrentUser(token);
    const modifiedRequest = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${token}`),
    });

    return next.handle(modifiedRequest);
  }
}
