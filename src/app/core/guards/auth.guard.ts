import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        console.log('not logged in');
        router.navigateByUrl('auth/signin');
        return false;
      }
      console.log('logged in');
      return true;
    })
  );
};
