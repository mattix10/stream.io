import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { ExpansionPanelMovieComponent } from './components/expansion-panel-movie/expansion-panel-movie.component';
import { UserService } from 'src/app/core/services/user-service/user-service.service';
import { mergeMap, Observable, of, tap, zip } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { UserDataComponent } from './components/user-data/user-data.component';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';
import { HeadersComponent } from './components/headers/headers.component';
import { UserData } from './models/user-data';
import { ActivatedRoute, Params } from '@angular/router';
import { UserMovieMetadata } from 'src/app/core/models/user-movie-metadata';

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
  isAdminUserEditMode: boolean = false;
  selectedMovieForEdit: UserMovieMetadata | null = null;

  movies?: UserMovieMetadata[];
  isContentCreator: boolean = false;
  isAdmin: boolean = false;

  readonly #userService = inject(UserService);
  readonly #authService = inject(AuthService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #moviesService = inject(MoviesService);
  readonly #activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.loadUserData();
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

  private loadUserData(): void {
    this.checkUserRole()
      .pipe(
        mergeMap(() =>
          this.isAdmin
            ? this.getUsernameFromQueryParam()
            : this.loadCurrentUser()
        )
      )
      .subscribe();
  }

  private checkUserRole(): Observable<any> {
    return zip([
      this.#authService.isContentCreator(),
      this.#authService.isAdmin(),
    ]).pipe(
      tap(([isContentCreator, isAdmin]) => {
        this.isContentCreator = isContentCreator;
        this.isAdmin = isAdmin;
      }),
      takeUntilDestroyed(this.#destroyRef)
    );
  }

  private getUsernameFromQueryParam(): Observable<any> {
    return this.#activatedRoute.queryParams.pipe(
      mergeMap((params: Params) => {
        const username = params['username'];
        this.checkIsAdminEditMode(username);

        return this.isAdminUserEditMode
          ? this.loadUserForAdminEditor(username)
          : of(null);
      })
    );
  }

  private checkIsAdminEditMode(username: string) {
    this.isAdminUserEditMode =
      !!username && location.pathname.includes('user-dashboard/edit');
  }

  private loadCurrentUser(): Observable<any> {
    return this.#authService.currentUser$.pipe(
      takeUntilDestroyed(this.#destroyRef),
      tap((user) => (this.user = user))
    );
  }

  private loadUserForAdminEditor(userId: string): Observable<any> {
    return this.#userService
      .getUser(userId)
      .pipe(tap(({ result }) => (this.user = result.user)));
  }

  private getUserMovies(): void {
    this.#moviesService
      .getMovies<UserMovieMetadata>()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((movies) => (this.movies = movies));
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
