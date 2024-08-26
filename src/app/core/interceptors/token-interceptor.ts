import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

export function tokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token || authService.isTokenExpired()) {
    authService.logout();
    return next(req);
  }

  authService.setCurrentUser(token);
  const modifiedRequest = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });

  return next(modifiedRequest);
}
