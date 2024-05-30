import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { ExpansionPanelMovieComponent } from './components/expansion-panel-movie/expansion-panel-movie.component';
import { UserService } from 'src/app/core/services/user-service/user-service.service';
import { Observable, map, of, tap } from 'rxjs';
import { Movie } from 'src/app/core/models/movie';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, MovieFormComponent, ExpansionPanelMovieComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit {
  readonly #userService = inject(UserService);
  readonly #authService = inject(AuthService);
  readonly #destroyRef = inject(DestroyRef);
  movies$?: Observable<Movie[]>;
  user?: User;

  isContentCreator$: Observable<boolean> = of(false);
  isUserAdmin$: Observable<boolean> = of(false);
  user$: Observable<User | null> = of(null);

  ngOnInit(): void {
    this.isContentCreator$ = this.#authService.isContentCreator();
    this.user$ = this.#authService.currentUser$;
    this.isUserAdmin$ = this.#authService.isAdmin();
    this.loadUser();
  }

  onMoviesChanged(movies: Movie[]): void {
    if (!this.user) {
      return;
    }

    this.user.movies = [...movies];
    this.updateUser();
  }

  private loadUser(): void {
    // TODO: Remove userId - make it dynamically
    const userId = '1';
    this.movies$ = this.#userService.getUser(userId).pipe(
      takeUntilDestroyed(this.#destroyRef),
      tap((user: User) => (this.user = user)),
      map(({ movies }) => movies)
    );
  }

  private updateUser(): void {
    if (!this.user) {
      return;
    }

    this.movies$ = this.#userService.updateUser(this.user.id, this.user).pipe(
      takeUntilDestroyed(this.#destroyRef),
      tap((user: User) => (this.user = user)),
      map(({ movies }) => movies)
    );
  }

  // Remove 'any'
  onMovieFormChanged(formValue: any): void {
    // this.#userService.updateUser(this.user?.id, this.user)
  }
}
