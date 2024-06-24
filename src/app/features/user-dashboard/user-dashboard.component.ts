import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { ExpansionPanelMovieComponent } from './components/expansion-panel-movie/expansion-panel-movie.component';
import { UserService } from 'src/app/core/services/user-service/user-service.service';
import { catchError, EMPTY, Observable, switchMap, tap, zip } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { UserDataComponent } from './components/user-data/user-data.component';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';
import { HeadersComponent } from './components/headers/headers.component';
import { UserMovieMetadata } from 'src/app/core/models/user-movie-metadata';
import { ToastrService } from 'ngx-toastr';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MovieFormComponent,
    ExpansionPanelMovieComponent,
    UserDataComponent,
    HeadersComponent,
    DeleteAccountComponent,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit {
  user: User | null = null;
  isEditMode: boolean = false;
  selectedMovieForEdit: UserMovieMetadata | null = null;
  movies?: UserMovieMetadata[];
  isContentCreator: boolean = false;
  isEndUser: boolean = false;
  isAdmin: boolean = false;

  readonly #userService = inject(UserService);
  readonly #authService = inject(AuthService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #moviesService = inject(MoviesService);
  readonly #toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.loadUserData();
    this.loadUserMovies();
    this.loadSelectedMovieForEdit();
  }

  onUserDataChanged(): void {
    this.loadUser().subscribe();
  }

  onEditModeChange(isEditMode: boolean): void {
    this.isEditMode = isEditMode;
    if (!this.isEditMode) this.#moviesService.selectedMovieForEdit$.next(null);
  }

  onRemoveMovieChanged(movieSlug: string): void {
    if (!movieSlug) return;

    this.#moviesService
      .deleteMovie(movieSlug)
      .pipe(
        switchMap(() => this.#moviesService.getMovies<UserMovieMetadata>()),
        tap((movies) => (this.movies = movies))
      )
      .subscribe();
    // TODO: loading
    // TODO: Catch error toastr
  }

  private loadUserData(): void {
    this.loadUser()
      .pipe(switchMap(() => this.checkUserRole()))
      .subscribe();
  }

  private checkUserRole(): Observable<any> {
    return zip([
      this.#authService.isContentCreator(),
      this.#authService.isEndUser(),
    ]).pipe(
      tap(([isContentCreator, isEndUser]) => {
        this.isContentCreator = isContentCreator;
        this.isEndUser = isEndUser;
      }),
      takeUntilDestroyed(this.#destroyRef)
    );
  }

  private loadUser(): Observable<any> {
    return this.#userService.getUser().pipe(
      catchError(() => {
        this.#toastrService.error('Nie udało się załadować danych użytkownika');
        return EMPTY;
      }),
      tap(({ result: user }) => {
        this.user = user;
      })
    );
  }

  private loadUserMovies(): void {
    this.#moviesService
      .getMovies<UserMovieMetadata>()
      .subscribe((movies) => (this.movies = movies));
  }

  private loadSelectedMovieForEdit(): void {
    this.#moviesService.selectedMovieForEdit$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((selectedMovieForEdit) => {
        this.isEditMode = !!selectedMovieForEdit;
        this.selectedMovieForEdit = selectedMovieForEdit;
      });
  }
}
