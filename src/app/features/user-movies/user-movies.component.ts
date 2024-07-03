import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { HeadersComponent } from './components/headers/headers.component';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';

import { ExpansionPanelMovieComponent } from './components/expansion-panel-movie/expansion-panel-movie.component';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, Observable, of, switchMap, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  UserContentMetadata,
  UserContentMetadataResponse,
} from 'src/app/core/models/responses/user-content-metadata-response';

@Component({
  selector: 'app-user-movies',
  standalone: true,
  imports: [
    AsyncPipe,
    HeadersComponent,
    MovieFormComponent,
    ExpansionPanelMovieComponent,
  ],
  templateUrl: './user-movies.component.html',
  styleUrl: './user-movies.component.scss',
})
export class UserMoviesComponent implements OnInit {
  #authService = inject(AuthService);
  #moviesService = inject(MoviesService);
  #destroyRef = inject(DestroyRef);
  #toastrService = inject(ToastrService);

  isContentCreator$ = this.#authService.isContentCreator();
  isEndUser$ = this.#authService.isEndUser();

  isEditMode = false;
  selectedContentMetadataForEdit: UserContentMetadata | null = null;
  contentMetadata?: UserContentMetadata[];

  ngOnInit(): void {
    this.getUserContentMetadata().subscribe();
    this.loadSelectedMovieForEdit();
  }

  onEditModeChange(isEditMode: boolean): void {
    this.isEditMode = isEditMode;
    if (!this.isEditMode) this.#moviesService.selectedMovieForEdit$.next(null);
  }

  onRemoveMovieChanged(movie: UserContentMetadata): void {
    this.deleteMovie(movie)
      .pipe(switchMap(() => this.getUserContentMetadata()))
      .subscribe();
  }

  private deleteMovie({
    uuid,
    title,
  }: UserContentMetadata): Observable<void | Observable<never>> {
    return this.#moviesService.deleteMovie(uuid).pipe(
      catchError((err: string) => {
        this.#toastrService.error(`Nie udało się usunąć filmu "${title}".`);
        return of(EMPTY);
      })
    );
  }

  private getUserContentMetadata(): Observable<
    UserContentMetadataResponse | Observable<never>
  > {
    return this.#moviesService.getUserContentMetadataResponse().pipe(
      tap(({ result }) => (this.contentMetadata = result)),
      catchError((err: string) => {
        this.#toastrService.error(
          `Nie udało się pobrać filmów użytkownika. ${err} `
        );
        return of(EMPTY);
      })
    );
  }

  private loadSelectedMovieForEdit(): void {
    this.#moviesService.selectedMovieForEdit$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((selectedMovieForEdit) => {
        this.isEditMode = !!selectedMovieForEdit;
        this.selectedContentMetadataForEdit = selectedMovieForEdit;
      });
  }
}
