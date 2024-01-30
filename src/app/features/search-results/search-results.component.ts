import { HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { mergeMap, take } from 'rxjs';
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
export class SearchResultsComponent {
  #moviesService = inject(MoviesService);
  #activatedRoute = inject(ActivatedRoute);
  movieItems: MovieItem[] = [];

  ngOnInit(): void {
    this.#activatedRoute.queryParams
      .pipe(
        mergeMap((params: Params) => {
          const searchValue = params['search'];
          let param = new HttpParams().set('search', searchValue);
          return this.#moviesService.getMovies(param);
        })
      )
      .subscribe((movieItems) => {
        console.log(movieItems);
        // TODO: Remove
        this.movieItems = movieItems.filter((d: any) => d.id.includes('1'));
      });
  }
}
