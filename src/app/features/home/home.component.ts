import { Component, OnInit, inject } from '@angular/core';
import { MovieItemComponent } from './movie-item/movie-item.component';
import { ContentService } from 'src/app/core/services/content.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  AllMoviesMetadataResponse,
  ContentMetadata,
} from 'src/app/core/models/responses/all-movies-metadata-response';
import { finalize, tap } from 'rxjs';
import { isLoading } from '../../core/models/loading';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MovieItemComponent,
    RouterModule,
    SpinnerComponent,
    NgxPaginationModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, isLoading {
  movieMetadataList: ContentMetadata[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 12;

  readonly #movieService = inject(ContentService);

  ngOnInit(): void {
    this.loadMovies();
  }

  private loadMovies(): void {
    this.isLoading = true;

    this.#movieService
      .getMovies()
      .pipe(
        tap(({ result }: AllMoviesMetadataResponse) => {
          this.movieMetadataList = result.contents;
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }
}
