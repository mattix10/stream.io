import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { mergeMap } from 'rxjs';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';
import { MovieMetadataComponent } from '../home/movie-item/movie-item.component';
import { CommonModule } from '@angular/common';
import { MovieMetadata } from 'src/app/core/models/movie-metadata';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, MovieMetadataComponent, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit {
  movieMetadataList: MovieMetadata[] = [];
  searchValue: string = '';

  readonly #searchParamName = 'search';
  readonly #moviesService = inject(MoviesService);
  readonly #activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.getSearchedMovies();
  }

  getSearchedMovies(): void {
    this.#activatedRoute.queryParams
      .pipe(
        mergeMap((params: Params) => {
          this.searchValue = params[this.#searchParamName]?.toLowerCase();
          const param = new HttpParams().set(
            this.#searchParamName,
            this.searchValue
          );
          return this.#moviesService.getMovies(param);
        })
      )
      .subscribe();
  }
}
