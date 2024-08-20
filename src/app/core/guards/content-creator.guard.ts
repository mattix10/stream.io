import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const contentCreatorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isContentCreator().pipe(
    map((isContentCreator) => {
      if (isContentCreator) return true;

      router.navigateByUrl('/');
      return false;
    })
  );
};
