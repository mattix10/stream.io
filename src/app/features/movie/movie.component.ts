import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Movie } from 'src/app/core/models/movie';
import { CommentsComponent } from './components/comment/comments.component';
import { MovieComment } from 'src/app/core/models/movie-comment';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, CommentsComponent],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss',
})
export class MovieComponent implements OnInit {
  #movieService = inject(MoviesService);
  #activatedRoute = inject(ActivatedRoute);
  comments: MovieComment[] = [];
  movie!: Movie;

  ngOnInit(): void {
    this.#activatedRoute.data.subscribe(({ movie }) => {
      console.log(movie);
      this.movie = movie;
      this.comments = this.movie!.comments;
      console.log(this.movie);
    });
  }

  onCommentChanged(comment: any): void {
    console.log(comment);
    this.#movieService;
    // .updateMovie(this.movie?.id, comment)
    // .pipe(takeUntilDestroyed());
  }
}
