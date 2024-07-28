import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // const token = authService.getToken();
  // if (!token) {
  //   console.log('here1');

  //   router.navigateByUrl('auth/signin');
  //   return of(false);
  // }

  // if (authService.isTokenExpired()) {
  //   console.log('here2');
  //   router.navigateByUrl('auth/signin');
  //   return of(false);
  // }
  return authService.isLoggedIn$.pipe(
    take(1),
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        router.navigateByUrl('auth/signin');
        return false;
      }

      // if (location.pathname.includes('auth')) {
      //   router.navigateByUrl('/');
      //   return false;
      // }

      return true;
    })
  );
};
