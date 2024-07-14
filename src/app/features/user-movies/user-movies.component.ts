import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { HeadersComponent } from './components/headers/headers.component';

import { ExpansionPanelMovieComponent } from './components/expansion-panel-movie/expansion-panel-movie.component';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, Observable, of, switchMap, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  UserContentMetadata,
  UserContentMetadataResponse,
} from 'src/app/core/models/responses/user-content-metadata-response';
import { ContentService } from 'src/app/core/services/content.service';
import { AuthService } from 'src/app/core/services/auth.service';

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
  #contentService = inject(ContentService);
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
    if (!this.isEditMode) this.#contentService.selectedMovieForEdit$.next(null);
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
    return this.#contentService.deleteMovie(uuid).pipe(
      catchError((err: string) => {
        this.#toastrService.error(`Nie udało się usunąć filmu "${title}".`);
        return of(EMPTY);
      })
    );
  }

  private getUserContentMetadata(): Observable<
    UserContentMetadataResponse | Observable<never>
  > {
    return this.#contentService.getUserContentMetadataResponse().pipe(
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
    this.#contentService.selectedMovieForEdit$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((selectedMovieForEdit) => {
        this.isEditMode = !!selectedMovieForEdit;
        this.selectedContentMetadataForEdit = selectedMovieForEdit;
      });
  }
}
