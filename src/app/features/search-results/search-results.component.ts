import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { map, mergeMap, tap } from 'rxjs';
import { ContentService } from 'src/app/core/services/content.service';
import { MovieItemComponent } from '../../shared/components/movie-item/movie-item.component';
import { CommonModule } from '@angular/common';
import { ContentMetadata } from 'src/app/core/models/interfaces/content-metadata';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [MovieItemComponent, RouterModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent implements OnInit {
  movieMetadataList: ContentMetadata[] = [];
  searchValue: string = '';

  readonly #searchParamName = 'search';
  readonly #contentService = inject(ContentService);
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
          return this.#contentService.getMovies(param).pipe(
            map(({ result }) =>
              result.contents.filter((content) =>
                content.title.toLowerCase().includes(this.searchValue)
              )
            ),
            tap(
              (movieMetadataList) =>
                (this.movieMetadataList = movieMetadataList)
            )
          );
        })
      )
      .subscribe();
  }
}
