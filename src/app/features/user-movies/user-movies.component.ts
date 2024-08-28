import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { HeadersComponent } from './components/headers/headers.component';

import { ExpansionPanelMovieComponent } from './components/expansion-panel-movie/expansion-panel-movie.component';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable, tap } from 'rxjs';
import { UserContentMetadataResponse } from 'src/app/core/models/responses/user-content-metadata-response';
import { ContentService } from 'src/app/core/services/content.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { isLoading } from 'src/app/core/models/interfaces/loading';
import { UserContentMetadata } from 'src/app/core/models/interfaces/user-content-metadata';

@Component({
  selector: 'app-user-movies',
  standalone: true,
  imports: [
    AsyncPipe,
    HeadersComponent,
    MovieFormComponent,
    ExpansionPanelMovieComponent,
    SpinnerComponent,
  ],
  templateUrl: './user-movies.component.html',
  styleUrl: './user-movies.component.scss',
})
export class UserMoviesComponent implements OnInit, isLoading {
  readonly #authService = inject(AuthService);
  readonly #contentService = inject(ContentService);
  readonly #destroyRef = inject(DestroyRef);

  isContentCreator$ = this.#authService.isContentCreator();
  isEndUser$ = this.#authService.isEndUser();

  isLoading: boolean = true;
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

  onSubmitForm(): void {
    this.getUserContentMetadata().subscribe();
  }

  onRemoveMovieChanged(): void {
    this.getUserContentMetadata().subscribe();
  }

  private getUserContentMetadata(): Observable<
    UserContentMetadataResponse | Observable<never>
  > {
    return this.#contentService.getUserContentMetadataResponse().pipe(
      tap(({ result }) => {
        this.contentMetadata = [...result.contentCreatorContents];
      }),
      finalize(() => (this.isLoading = false))
    );
  }

  private loadSelectedMovieForEdit(): void {
    this.#contentService.selectedMovieForEdit$
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        tap((selectedMovieForEdit) => {
          this.isEditMode = !!selectedMovieForEdit;
          this.selectedContentMetadataForEdit = selectedMovieForEdit;
        })
      )
      .subscribe();
  }
}
