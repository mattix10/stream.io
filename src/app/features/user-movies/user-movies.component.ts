import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { HeadersComponent } from './components/headers/headers.component';

import { ExpansionPanelMovieComponent } from './components/expansion-panel-movie/expansion-panel-movie.component';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, tap } from 'rxjs';
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
  readonly #authService = inject(AuthService);
  readonly #contentService = inject(ContentService);
  readonly #destroyRef = inject(DestroyRef);

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
      })
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
