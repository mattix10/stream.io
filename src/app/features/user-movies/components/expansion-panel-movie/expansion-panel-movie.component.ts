import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  DEFAULT_CURRENCY_CODE,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  LOCALE_ID,
  Output,
} from '@angular/core';
import { ContentService } from 'src/app/core/services/content.service';
import '@angular/common/locales/global/pl';
import { LicenseTypePipe } from '../../pipes/license-type.pipe';
import { LicenseDurationPipe } from '../../pipes/license-duration.pipe';
import { Observable, tap } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FileUploadService } from '../../services/file-upload.service';
import { UserContentMetadata } from 'src/app/core/models/interfaces/user-content-metadata';

type MovieListItem = UserContentMetadata & {
  isExpanded: boolean;
};
@Component({
  selector: 'app-expansion-panel-movie',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    LicenseTypePipe,
    LicenseDurationPipe,
    NgxPaginationModule,
  ],
  templateUrl: './expansion-panel-movie.component.html',
  styleUrl: './expansion-panel-movie.component.scss',
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pl',
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'zł',
    },
    FileUploadService,
  ],
})
export class ExpansionPanelMovieComponent {
  @Input() set movies(movies: UserContentMetadata[]) {
    this.createMovieList(movies);
  }
  @Input({ required: true }) isEditMode: boolean = false;

  @Output() removeMovieChanged = new EventEmitter<void>();
  movieList: MovieListItem[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 22;
  selectedMovie?: MovieListItem;

  readonly #contentService = inject(ContentService);
  readonly #destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.#contentService.selectedMovieForEdit$
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        tap((movie) => {
          if (!movie) {
            this.selectedMovie = undefined;
          }
        })
      )
      .subscribe();
  }

  toggleMovie(uuid: string): void {
    this.movieList = this.movieList.map((movie) =>
      movie.uuid === uuid ? { ...movie, isExpanded: !movie.isExpanded } : movie
    );
  }

  editMovie(uuid: string): void {
    this.selectedMovie = this.movieList.find((movie) => movie.uuid === uuid);
    if (!this.selectedMovie) return;

    this.#contentService.selectedMovieForEdit$.next(this.selectedMovie);
  }

  deleteMovie(movie: UserContentMetadata): void {
    this.removeMetadataContent(movie).subscribe();
  }

  private removeMetadataContent({
    uuid,
  }: UserContentMetadata): Observable<void> {
    return this.#contentService.deleteContent(uuid).pipe(
      tap(() => {
        this.removeMovieChanged.emit();
      })
    );
  }

  private createMovieList(movies: UserContentMetadata[]): void {
    this.movieList = movies.map((movie) => ({
      ...movie,
      isExpanded: false,
    }));
  }
}
