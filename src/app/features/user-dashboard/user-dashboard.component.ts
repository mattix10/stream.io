import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { ExpansionPanelMovieComponent } from './components/expansion-panel-movie/expansion-panel-movie.component';
import { UserService } from 'src/app/core/services/user-service/user-service.service';
import { Observable, of } from 'rxjs';
import { Movie } from 'src/app/core/models/movie';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { UserDataComponent } from './components/user-data/user-data.component';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';
import { HeadersComponent } from './components/headers/headers.component';
import { UserData } from './models/user-data';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MovieFormComponent,
    ExpansionPanelMovieComponent,
    UserDataComponent,
    HeadersComponent,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit {
  user: User | null = null;
  isEditMode: boolean = false;
  selectedMovieForEdit: Movie | null = null;

  movies?: Movie[];
  isContentCreator$: Observable<boolean> = of(false);
  isUserAdmin$: Observable<boolean> = of(false);

  readonly #userService = inject(UserService);
  readonly #authService = inject(AuthService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #moviesService = inject(MoviesService);

  ngOnInit(): void {
    this.loadUser();
    this.checkUserRole();
    this.getUserMovies();
    this.getSelectedMovieForEdit();
  }

  onUserDataChanged({ password, email }: UserData): void {
    this.#userService.updateMe('', { password, email });
  }

  onEditModeChange(isEditMode: boolean): void {
    this.isEditMode = isEditMode;
  }

  onMovieFormChanged(formValue: any): void {
    // this.#userService.updateUser(this.user?.id, this.user)
  }

  onRemoveMovieChanged(movieId: string): void {
    if (!movieId) {
      return;
    }

    this.#moviesService.deleteMovie(movieId);
    // TODO: loading
    // TODO: Catch error toastr
  }

  private loadUser(): void {
    this.#authService.currentUser$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((user) => (this.user = user));
  }

  private checkUserRole(): void {
    this.isContentCreator$ = this.#authService.isContentCreator();
    this.isUserAdmin$ = this.#authService.isAdmin();
  }

  private getUserMovies(): void {
    this.#moviesService.getMovies().pipe(takeUntilDestroyed(this.#destroyRef));
    // .subscribe((movies) => (this.movies = movies));
  }

  private getSelectedMovieForEdit(): void {
    this.#moviesService.selectedMovieForEdit$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((selectedMovieForEdit) => {
        this.isEditMode = !!selectedMovieForEdit;
        this.selectedMovieForEdit = selectedMovieForEdit;
      });
  }
}
