import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CommentsComponent } from './components/comment/comments.component';
import { MovieComment } from 'src/app/core/models/movie-comment';
import { ContentService } from 'src/app/core/services/content.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  catchError,
  combineLatest,
  EMPTY,
  finalize,
  mergeMap,
  Observable,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { MovieMetadata } from 'src/app/core/models/movie-metadata';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { isLoading } from '../../core/models/loading';
import { MovieMetadataResponse } from 'src/app/core/models/responses/movie-metadata-response';
import { MovieLinkResponse } from 'src/app/core/models/responses/movie-link-response';
import {
  AllMoviesMetadataResponse,
  ContentMetadata,
} from 'src/app/core/models/responses/all-movies-metadata-response';
import { HttpParams } from '@angular/common/http';
import { MovieItemComponent } from '../home/movie-item/movie-item.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { MovieMetadataComponent } from './components/movie-metadata/movie-metadata.component';
import { LicenseService } from './services/license.service';
import { MovieImageComponent } from './components/movie-image/movie-image.component';
import { LicenseDialogComponent } from './components/license-dialog/license-dialog.component';
import { LicenseDialogType } from './models/license-dialog-type';
import { License } from 'src/app/core/models/responses/license-response';
import { LicenseType } from 'src/app/core/models/license-type.enum';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [
    CommonModule,
    CommentsComponent,
    SpinnerComponent,
    MovieItemComponent,
    VideoPlayerComponent,
    MovieMetadataComponent,
    MovieImageComponent,
    LicenseDialogComponent,
  ],
  providers: [LicenseService],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
})
export class MovieComponent implements OnInit, isLoading {
  comments: MovieComment[] = [];
  movieMetadata?: MovieMetadata;
  movieLink: string = '';
  contentId: string = '';
  isLoading: boolean = false;
  isLoadingMovieLink: boolean = false;
  isLoadingRecommendedMovies: boolean = false;
  isLoadingLicense: boolean = false;
  recommendedMovies: ContentMetadata[] = [];
  submitComment = new Subject<void>();
  isLicenseValid: boolean = false;
  licenseDialogType?: LicenseDialogType;
  license!: License;

  readonly #movieService = inject(ContentService);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #authService = inject(AuthService);
  readonly #licenseService = inject(LicenseService);
  readonly isLoggedIn$ = this.#authService.isLoggedIn$.pipe(take(1));
  protected licenseId?: string;

  ngOnInit(): void {
    this.getMovieDetails();
  }

  onCommentChanged(body: string): void {
    this.#movieService
      .createComment({ body, contentId: this.contentId })
      .pipe(
        tap(() => this.submitComment.next()),
        mergeMap(() => this.getMovieMetadata())
      )
      .subscribe();
  }

  private getMovieDetails(): void {
    this.getMovieuuid()
      .pipe(
        // delay(500),
        switchMap(() =>
          this.isLoggedIn$.pipe(
            switchMap((isLoggedIn) => {
              let calls: Observable<any>[] = [
                this.getMovieMetadata(),
                this.getRecommendedMovies(),
              ];

              if (isLoggedIn) {
                calls.push(this.handleMovieLicense());
              }

              return combineLatest(calls);
            })
          )
        )
      )
      .subscribe();
  }

  private getMovieuuid(): Observable<ParamMap> {
    return this.#activatedRoute.paramMap.pipe(
      tap((params: ParamMap) => {
        this.contentId = params.has('contentId')
          ? params.get('contentId')!
          : '';

        if (!this.contentId) return;

        this.resetMovieData();
      })
    );
  }

  private getMovieMetadata(): Observable<MovieMetadataResponse> {
    this.isLoading = true;

    return this.#movieService.getContent(this.contentId).pipe(
      tap(({ result }) => {
        this.movieMetadata = result;
        this.movieMetadata.licenseRules
          .sort((a) => (a.type === LicenseType.Buy ? -1 : 1))
          .sort((a, b) => (a.price > b.price ? -1 : 1));
      }),
      finalize(() => (this.isLoading = false))
    );
  }

  private getRecommendedMovies(): Observable<AllMoviesMetadataResponse> {
    this.isLoadingRecommendedMovies = true;

    return this.#movieService
      .getMovies(new HttpParams().set('limit', '10'))
      .pipe(
        tap(({ result }: AllMoviesMetadataResponse) => {
          this.recommendedMovies = result.contents.filter(
            (content) => content.uuid !== this.contentId
          );
        }),
        finalize(() => (this.isLoadingRecommendedMovies = false))
      );
  }

  private handleMovieLicense(): Observable<MovieLinkResponse> {
    this.isLicenseValid = false;
    this.isLoadingLicense = true;

    return this.#licenseService.getLicense(this.contentId).pipe(
      // delay(500),
      catchError(() => {
        this.licenseDialogType = LicenseDialogType.Buy;
        return EMPTY;
      }),
      mergeMap(({ result }) => {
        if (result.keyData == null) {
          this.licenseDialogType = LicenseDialogType.Renew;
          this.licenseId = result.uuid;
          return EMPTY;
        }

        this.license = result;
        this.isLicenseValid = true;

        return this.getMovieLink();
      }),
      finalize(() => (this.isLoadingLicense = false))
    );
  }

  private getMovieLink(): Observable<MovieLinkResponse> {
    this.isLoadingMovieLink = true;

    return this.#movieService.getVideoLink(this.contentId).pipe(
      tap(({ result }) => {
        this.movieLink = result.url;
      }),
      finalize(() => {
        this.isLoadingMovieLink = false;
      })
    );
  }

  private resetMovieData(): void {
    this.movieMetadata = undefined;
    this.movieLink = '';
    this.isLoading = true;
    this.isLicenseValid = false;
  }

  onSubmitLicense(): void {
    this.handleMovieLicense().subscribe();
  }
}
