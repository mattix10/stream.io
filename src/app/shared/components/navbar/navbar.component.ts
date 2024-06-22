import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  user$: Observable<User | null> = of(null);
  isUserAdmin$: Observable<boolean> = of(false);

  protected isMobileMenuVisible = false;
  protected searchValue: string = '';

  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #authService = inject(AuthService);

  ngOnInit(): void {
    this.getSearchValue();
    this.getCurrentUser();
    this.checkIsUserAdmin();
  }

  logout(): void {
    this.#authService.logout();
  }

  protected toggleMobileVisibility(): void {
    this.isMobileMenuVisible = !this.isMobileMenuVisible;
  }

  protected resetSearchValue(): void {
    this.searchValue = '';
  }

  protected navigateToSearchResults(): void {
    this.#router.navigate(['search-results'], {
      queryParams: {
        search: this.searchValue ? this.searchValue : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  private getSearchValue(): void {
    this.#activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchValue = params['search'];
    });
  }

  private getCurrentUser(): void {
    this.user$ = this.#authService.currentUser$.pipe(
      tap((user) => console.log(user))
    );
  }

  private checkIsUserAdmin(): void {
    this.isUserAdmin$ = this.#authService.isAdmin();
  }
}
