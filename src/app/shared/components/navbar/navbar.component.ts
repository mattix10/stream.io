import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { tap } from 'rxjs';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  protected isMobileMenuVisible = false;
  protected searchValue: string = '';

  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #authService = inject(AuthService);
  readonly #destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getSearchValue();
    this.getUserData();
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

  private getUserData(): void {
    this.#authService.currentUser$
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        tap((data: any) => console.log(data))
      )
      .subscribe((user) => (this.user = user));
  }
}
