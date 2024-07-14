import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  DEFAULT_CURRENCY_CODE,
  EventEmitter,
  inject,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
} from '@angular/core';
import { ContentService } from 'src/app/core/services/content.service';
import { FileStatusDirective } from 'src/app/features/user-movies/directives/file-status.directive';
import { FileStatusPipe } from 'src/app/features/user-movies/pipes/file-status.pipe';
import '@angular/common/locales/global/pl';
import { LicenseTypePipe } from '../../pipes/license-type.pipe';
import { LicenseDurationPipe } from '../../pipes/license-duration.pipe';
import { UserContentMetadata } from 'src/app/core/models/responses/user-content-metadata-response';

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
  ],
})
export class ExpansionPanelMovieComponent implements OnInit {
  @Input() movies: UserContentMetadata[] = [];
  @Input({ required: true }) isEditMode: boolean = false;
  @Output() removeMovieChanged = new EventEmitter<UserContentMetadata>();

  movieList: MovieListItem[] = [];

  readonly #contentService = inject(ContentService);

  ngOnInit(): void {
    this.addExpandedtoMovieList();
  }

  toggleMovie(uuid: string): void {
    this.movieList = this.movieList.map((movie) =>
      movie.uuid === uuid ? { ...movie, isExpanded: !movie.isExpanded } : movie
    );
    console.log(this.movieList);
  }

  editMovie(uuid: string): void {
    const movie = this.movieList.find((movie) => movie.uuid === uuid);
    console.log(movie);
    if (!movie) return;
    this.#contentService.selectedMovieForEdit$.next(movie);
  }

  deleteMovie(movie: UserContentMetadata): void {
    this.removeMovieChanged.emit(movie);
  }

  private addExpandedtoMovieList(): void {
    this.movieList = this.movies.map((movie) => ({
      ...movie,
      isExpanded: false,
    }));
  }
}
