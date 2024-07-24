import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CommentsComponent } from './components/comment/comments.component';
import { MovieComment } from 'src/app/core/models/movie-comment';
import { ContentService } from 'src/app/core/services/content.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  finalize,
  forkJoin,
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
  ],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
})
export class MovieComponent implements OnInit, isLoading {
  comments: MovieComment[] = [];
  movieMetadata?: MovieMetadata;
  movieLink: string = '';
  uuid: string = '';
  isLoading: boolean = false;
  isLoadingMovieLink: boolean = false;
  isLoadingRecommendedMovies: boolean = false;
  recommendedMovies: ContentMetadata[] = [];
  submitComment = new Subject<void>();

  readonly #movieService = inject(ContentService);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #authService = inject(AuthService);
  readonly isLoggedIn$ = this.#authService.isLoggedIn$.pipe(take(1));

  ngOnInit(): void {
    this.getMovieDetails();
  }

  onCommentChanged(body: string): void {
    this.#movieService
      .createComment({ body, contentId: this.uuid })
      .pipe(
        tap(() => this.submitComment.next()),
        mergeMap(() => this.getMovieMetadata())
      )
      .subscribe();
  }

  private getMovieDetails(): void {
    this.getMovieuuid()
      .pipe(
        mergeMap(() =>
          this.isLoggedIn$.pipe(
            switchMap((isLoggedIn) => {
              let calls: Observable<any>[] = [
                this.getMovieMetadata(),
                this.getRecommendedMovies(),
              ];

              if (isLoggedIn) {
                calls.push(this.getMovieLink());
              }

              return forkJoin(calls);
            })
          )
        )
      )
      .subscribe();
  }

  private getMovieuuid(): Observable<ParamMap> {
    return this.#activatedRoute.paramMap.pipe(
      tap((params: ParamMap) => {
        this.uuid = params.has('uuid') ? params.get('uuid')! : '';

        if (!this.uuid) return;
      })
    );
  }

  private getMovieMetadata(): Observable<MovieMetadataResponse> {
    this.isLoading = true;

    return this.#movieService.getContent(this.uuid).pipe(
      tap(({ result }) => (this.movieMetadata = result)),
      finalize(() => (this.isLoading = false))
    );
  }

  private getMovieLink(): Observable<MovieLinkResponse> {
    this.isLoadingMovieLink = true;

    return this.#movieService.getVideoLink(this.uuid).pipe(
      tap(({ result }) => {
        this.movieLink = result.url;
      }),
      finalize(() => {
        this.isLoadingMovieLink = false;
      })
    );
  }

  private getRecommendedMovies(): Observable<AllMoviesMetadataResponse> {
    this.isLoadingRecommendedMovies = true;

    return this.#movieService
      .getMovies(new HttpParams().set('limit', '10'))
      .pipe(
        tap(({ result }: AllMoviesMetadataResponse) => {
          this.recommendedMovies = result.contents.filter(
            (content) => content.uuid !== this.uuid
          );
        }),
        finalize(() => (this.isLoadingRecommendedMovies = false))
      );
  }
}
