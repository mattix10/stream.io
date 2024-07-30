import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  protected isMobileMenuVisible = false;
  protected searchValue: string = '';

  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #authService = inject(AuthService);

  isUserAdmin$ = this.#authService.isAdmin();
  isContentCreator$ = this.#authService.isContentCreator();
  user$ = this.#authService.currentUser$;

  ngOnInit(): void {
    this.getSearchValue();
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
}
