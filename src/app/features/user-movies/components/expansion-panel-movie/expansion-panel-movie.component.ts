import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  DEFAULT_CURRENCY_CODE,
  EventEmitter,
  inject,
  Input,
  LOCALE_ID,
  Output,
} from '@angular/core';
import { ContentService } from 'src/app/core/services/content.service';
import { FileStatusDirective } from 'src/app/features/user-movies/directives/file-status.directive';
import { FileStatusPipe } from 'src/app/features/user-movies/pipes/file-status.pipe';
import '@angular/common/locales/global/pl';
import { LicenseTypePipe } from '../../pipes/license-type.pipe';
import { LicenseDurationPipe } from '../../pipes/license-duration.pipe';
import { UserContentMetadata } from 'src/app/core/models/responses/user-content-metadata-response';
import { FileStatus } from '../../models/file-status';
import { FileUploadService } from '../../services/file-upload-service/file-upload.service';
import { Observable, switchMap, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

type MovieListItem = UserContentMetadata & {
  isExpanded: boolean;
};
@Component({
  selector: 'app-expansion-panel-movie',
  standalone: true,
  imports: [
    CommonModule,
    FileStatusPipe,
    FileStatusDirective,
    CurrencyPipe,
    LicenseTypePipe,
    LicenseDurationPipe,
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
  readonly #contentService = inject(ContentService);
  readonly #fileUploadService = inject(FileUploadService);
  readonly #toastrService = inject(ToastrService);

  toggleMovie(uuid: string): void {
    this.movieList = this.movieList.map((movie) =>
      movie.uuid === uuid ? { ...movie, isExpanded: !movie.isExpanded } : movie
    );
  }

  editMovie(uuid: string): void {
    const movie = this.movieList.find((movie) => movie.uuid === uuid);
    if (!movie) return;

    this.#contentService.selectedMovieForEdit$.next(movie);
  }

  deleteMovie(movie: UserContentMetadata): void {
    if (
      movie.imageStatus === FileStatus.InProgress ||
      movie.contentStatus === FileStatus.InProgress
    ) {
      this.#toastrService.info(
        'Nie można usunąć zawartości, ponieważ pliki są w trakcie wgrywania.'
      );
      return;
    }

    if (movie.imageStatus === FileStatus.Success) {
      this.#fileUploadService
        .getImageLink(movie.uuid)
        .pipe(
          switchMap(({ result }) => {
            return this.#fileUploadService.delete(result.url).pipe(
              switchMap(() => {
                if (movie.contentStatus === FileStatus.Success) {
                  return this.removeVideoFile(movie).pipe(
                    switchMap(() => this.removeMetadataContent(movie))
                  );
                }

                return this.removeMetadataContent(movie);
              })
            );
          })
        )
        .subscribe();
      return;
    }

    if (movie.contentStatus === FileStatus.Success) {
      this.removeVideoFile(movie)
        .pipe(
          switchMap(() => {
            if (movie.imageStatus === FileStatus.Success) {
              return this.removeVideoFile(movie).pipe(
                switchMap(() => this.removeMetadataContent(movie))
              );
            }

            return this.removeMetadataContent(movie);
          })
        )
        .subscribe();
      return;
    }

    this.removeMetadataContent(movie).subscribe();
  }

  private removeMetadataContent(movie: UserContentMetadata): Observable<void> {
    return this.#contentService.deleteContent(movie.uuid).pipe(
      tap(() => {
        this.removeMovieChanged.emit();
        this.#toastrService.success('Film został usunięty pomyślnie');
      })
    );
  }

  private removeVideoFile(movie: UserContentMetadata): Observable<any> {
    return this.#fileUploadService
      .getVideoLink(movie.uuid)
      .pipe(
        switchMap(({ result }) => this.#fileUploadService.delete(result.url))
      );
  }

  private createMovieList(movies: UserContentMetadata[]): void {
    this.movieList = movies.map((movie) => ({
      ...movie,
      isExpanded: false,
    }));
  }
}
