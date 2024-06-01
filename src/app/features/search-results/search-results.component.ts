import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { mergeMap } from 'rxjs';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';
import { MovieItemComponent } from '../home/movie-item/movie-item.component';
import { MovieItem } from 'src/app/core/models/movie-item';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, MovieItemComponent, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit {
  #moviesService = inject(MoviesService);
  #activatedRoute = inject(ActivatedRoute);
  movieItems: MovieItem[] = [];
  searchValue: string = '';
  searchParamName = 'search';

  ngOnInit(): void {
    this.getSearchedMovies();
  }

  getSearchedMovies(): void {
    this.#activatedRoute.queryParams
      .pipe(
        mergeMap((params: Params) => {
          this.searchValue = params[this.searchParamName]?.toLowerCase();
          const param = new HttpParams().set(
            this.searchParamName,
            this.searchValue
          );
          return this.#moviesService.getMovies(param);
        })
      )
      .subscribe((movieItems) => {
        console.log(movieItems);
        // TODO: Remove
        this.movieItems = movieItems.filter((movie: any) =>
          movie.title.toLowerCase().includes(this.searchValue)
        );
      });
  }
}
