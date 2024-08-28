import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { NavigationMobileComponent } from '../navigation-mobile/navigation-mobile.component';
import { NavigationDesktopComponent } from '../navigation-desktop/navigation-desktop.component';
import { combineLatest, map, Observable } from 'rxjs';
import { User } from 'src/app/core/models/classes/user';
import { SearchMovieInputComponent } from '../search-movie-input/search-movie-input.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NavigationMobileComponent,
    NavigationDesktopComponent,
    SearchMovieInputComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  protected isMobileMenuVisible = false;

  protected data$?: Observable<{
    user: User | null;
    isUserAdmin: boolean;
    isContentCreator: boolean;
  }>;

  readonly #authService = inject(AuthService);

  ngOnInit(): void {
    this.data$ = combineLatest([
      this.#authService.isAdmin(),
      this.#authService.isContentCreator(),
      this.#authService.currentUser$,
    ]).pipe(
      map(([isUserAdmin, isContentCreator, user]) => ({
        isUserAdmin,
        isContentCreator,
        user,
      }))
    );
  }

  logout(): void {
    this.#authService.logout();
  }

  protected toggleMobileMenuVisibility(): void {
    this.isMobileMenuVisible = !this.isMobileMenuVisible;
  }
}
