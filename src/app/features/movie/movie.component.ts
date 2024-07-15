import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CommentsComponent } from './components/comment/comments.component';
import { MovieComment } from 'src/app/core/models/movie-comment';
import { ContentService } from 'src/app/core/services/content.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { catchError, EMPTY, finalize, mergeMap, Observable, tap } from 'rxjs';
import { MovieMetadata } from 'src/app/core/models/movie-metadata';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { isLoading } from '../auth/models/loading';
import { ToastrService } from 'ngx-toastr';
import { MovieMetadataResponse } from 'src/app/core/models/responses/movie-metadata-response';
import { MovieLinkResponse } from 'src/app/core/models/responses/movie-link-response';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, CommentsComponent, SpinnerComponent],
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

  readonly #movieService = inject(ContentService);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);
  readonly #toastrService = inject(ToastrService);
  readonly isLoggedIn$ = this.#authService.isLoggedIn$;

  ngOnInit(): void {
    this.getMovieDetails();
    // this.getMovieLink().subscribe((data) => console.log(data));
  }

  onCommentChanged(body: string): void {
    this.#movieService
      // Ask about it: contentId or uuid?
      .createComment({ body, contentId: this.uuid })
      .pipe(mergeMap(() => this.getMovieMetadata()))
      .subscribe();
  }

  private getMovieDetails(): void {
    this.getMovieuuid()
      .pipe(
        mergeMap(() =>
          this.#authService.isLoggedIn$.pipe(
            tap((isLoggedIn) => {
              if (!isLoggedIn) {
                this.getMovieMetadata().subscribe();
                return;
              }

              this.movieMetadata
                ? this.getMovieLink().subscribe()
                : this.getAllMovieData();
            })
          )
        )
      )
      .subscribe();
  }

  private getMovieuuid(): Observable<ParamMap> {
    return this.#activatedRoute.paramMap.pipe(
      tap((params: ParamMap) => {
        console.log(params);
        console.log(params.get('uuid')!);
        this.uuid = params.has('uuid') ? params.get('uuid')! : '';
        console.log(this.uuid);

        if (!this.uuid) return;

        const navigation = this.#router.getCurrentNavigation();

        if (navigation?.extras?.state) {
          this.movieMetadata = navigation.extras.state['movieMetadata'];
        }
      })
    );
  }

  private getAllMovieData(): void {
    this.getMovieMetadata().subscribe((data) => console.log(data));
    this.getMovieLink().subscribe();
  }

  private getMovieMetadata(): Observable<MovieMetadataResponse> {
    this.isLoading = true;

    return this.#movieService.getContent(this.uuid).pipe(
      tap(({ result }) => (this.movieMetadata = result)),
      catchError((err) => {
        this.#toastrService.error('Nie udało się załadować metadanych');
        console.error(err);
        return EMPTY;
      }),
      finalize(() => (this.isLoading = false))
    );
  }

  private getMovieLink(): Observable<MovieLinkResponse> {
    this.isLoadingMovieLink = true;
    console.log('here');
    console.warn(this.uuid);
    return this.#movieService.getMovieLink(this.uuid).pipe(
      // return this.#movieService
      // .getMovieLink('f41bcc28-191e-4e2a-b7ae-7c32590e93ea')
      // .pipe(
      tap((data) => console.log('data: ', data)),
      tap(({ result }) => (this.movieLink = result.url)),
      catchError((err) => {
        this.#toastrService.error('Nie udało się załadować filmu');
        console.error(err);
        return EMPTY;
      }),
      finalize(() => (this.isLoadingMovieLink = false))
    );
  }
}
