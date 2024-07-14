import { Component, OnInit, inject } from '@angular/core';
import { MovieMetadataComponent } from './movie-item/movie-item.component';
import { ContentService } from 'src/app/core/services/content.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  AllMoviesMetadataResponse,
  ContentMetadata,
} from 'src/app/core/models/responses/all-movies-metadata-response';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { isLoading } from '../auth/models/loading';
import { ToastrService } from 'ngx-toastr';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MovieMetadataComponent,
    RouterModule,
    SpinnerComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, isLoading {
  movieMetadataList: ContentMetadata[] = [];
  isLoading: boolean = false;

  readonly #movieService = inject(ContentService);
  readonly #toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.getMovies();
  }

  private getMovies(): void {
    this.isLoading = true;
    this.#movieService
      .getMovies()
      .pipe(
        tap(
          ({ contents }: AllMoviesMetadataResponse) =>
            (this.movieMetadataList = contents)
        ),
        catchError((err) => {
          this.#toastrService.error(
            'Wystąpił błąd. Nie udało się załadować filmów.'
          );
          console.error(err);
          return EMPTY;
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }
}
