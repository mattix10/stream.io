import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CommentsComponent } from './components/comment/comments.component';
import { MovieComment } from 'src/app/core/models/movie-comment';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { mergeMap, Observable, of, tap } from 'rxjs';
import { MovieMetadata } from 'src/app/core/models/movie-metadata';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, CommentsComponent],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
})
export class MovieComponent implements OnInit {
  comments: MovieComment[] = [];
  movieMetadata!: MovieMetadata;
  isLoggedIn$: Observable<boolean> = of(false);
  movieLink: string = '';
  movieSlug: string = '';

  readonly #movieService = inject(MoviesService);
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  ngOnInit(): void {
    this.isLoggedIn$ = this.#authService.isLoggedIn$;
    this.getMovieDetails();
  }

  onCommentChanged(comment: string): void {
    this.#movieService
      .postComment(comment)
      .pipe(mergeMap(() => this.getComments()))
      .subscribe();
  }

  private getMovieDetails(): void {
    this.getMovieSlug()
      .pipe(
        mergeMap(() =>
          this.isLoggedIn$.pipe(
            tap((isLoggedIn) => {
              if (isLoggedIn) {
                if (this.movieMetadata) {
                  this.getMovieLinkAndComments();
                } else {
                  this.getAllMovieData();
                }
              } else {
                this.getMovieMetadata().subscribe();
              }
            })
          )
        )
      )
      .subscribe();
  }

  private getMovieSlug(): Observable<ParamMap> {
    return this.#activatedRoute.paramMap.pipe(
      tap((params: ParamMap) => {
        this.movieSlug = params.has('slug') ? params.get('slug')! : '';

        if (!this.movieSlug) return;

        const navigation = this.#router.getCurrentNavigation();

        if (navigation?.extras?.state) {
          this.movieMetadata = navigation.extras.state['movieMetadata'];
        }
      })
    );
  }

  private getMovieLinkAndComments(): void {
    this.getComments().subscribe();
    this.getMovieLink().subscribe();
  }

  private getAllMovieData(): void {
    this.getMovieMetadata().subscribe();
    this.getMovieLinkAndComments();
  }

  private getMovieMetadata(): Observable<MovieMetadata> {
    return this.#movieService
      .getMovieMetadata(this.movieSlug)
      .pipe(tap((metadata) => (this.movieMetadata = metadata)));
  }

  private getMovieLink(): Observable<string> {
    return this.#movieService
      .getMovieLink(this.movieSlug)
      .pipe(tap((movieLink) => (this.movieLink = movieLink)));
  }

  private getComments(): Observable<MovieComment[]> {
    return this.#movieService
      .getComments(this.movieSlug)
      .pipe(tap((comments) => (this.comments = comments)));
  }
}
