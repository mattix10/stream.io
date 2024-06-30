import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { HeadersComponent } from '../user-dashboard/components/headers/headers.component';
import { UserMovieMetadata } from 'src/app/core/models/user-movie-metadata';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';
import { UserContentMetadata } from 'src/app/core/models/user-content-metadata-response';
import { ExpansionPanelMovieComponent } from './components/expansion-panel-movie/expansion-panel-movie.component';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  isContentCreator$ = this.#authService.isContentCreator();
  isEndUser$ = this.#authService.isEndUser();

  contentMetadata?: UserContentMetadata[];

  isEditMode = false;
  selectedContentMetadataForEdit: UserContentMetadata | null = null;

  onEditModeChange(isEditMode: boolean): void {
    // this.isEditMode = isEditMode;
    // if (!this.isEditMode) this.#moviesService.selectedMovieForEdit$.next(null);
  }

  onRemoveMovieChanged(event: any): void {}

  ngOnInit(): void {
    this.loadUserContentMetadata();
  }

  private loadUserContentMetadata(): void {
    this.#moviesService
      .getUserContentMetadataResponse()
      .subscribe(({ result }) => (this.contentMetadata = result));
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
