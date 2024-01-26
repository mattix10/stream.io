import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { ExpansionPanelMovieComponent } from './components/expansion-panel-movie/expansion-panel-movie.component';
import { UserService } from 'src/app/core/services/user-service/user-service.service';
import { Observable, map, tap } from 'rxjs';
import { Movie } from 'src/app/core/models/movie';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, MovieFormComponent, ExpansionPanelMovieComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit {
  readonly #userService = inject(UserService);
  readonly #destroyRef = inject(DestroyRef);
  movies$?: Observable<Movie[]>;
  user?: User;

  ngOnInit(): void {
    // TODO: Remove userId - make it dynamically
    const userId = '1';
    this.movies$ = this.#userService.getUser(userId).pipe(
      takeUntilDestroyed(this.#destroyRef),
      tap((user: User) => (this.user = user)),
      map(({ movies }) => movies)
    );
  }

  onMoviesChanged(movies: Movie[]): void {
    if (!this.user) {
      return;
    }

    // TODO: Remove userId - make it dynamically
    const userId = '1';
    this.user.movies = [...movies];
    this.#userService
      .updateUser(userId, this.user)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((user) => (this.user = user));
  }
}
