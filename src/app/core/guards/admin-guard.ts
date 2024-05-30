import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth-service/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAdmin().pipe(
    map((isAdmin) => {
      if (!isAdmin) {
        router.navigateByUrl('/');
        return false;
      }
      return true;
    })
  );
};
