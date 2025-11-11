import { Component, OnInit, inject } from '@angular/core';
import { MovieItemComponent } from '../../shared/components/movie-item/movie-item.component';
import { ContentService } from 'src/app/core/services/content.service';
import { RouterModule } from '@angular/router';
import { AllMoviesMetadataResponse } from 'src/app/core/models/responses/all-movies-metadata-response';
import { finalize, tap } from 'rxjs';
import { isLoading } from '../../core/models/interfaces/loading';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ContentMetadata } from 'src/app/core/models/interfaces/content-metadata';
import { HttpParams } from '@angular/common/http';

@Component({
    selector: 'app-home',
    imports: [
        MovieItemComponent,
        RouterModule,
        SpinnerComponent,
        NgxPaginationModule,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, isLoading {
  contentMetadataList: ContentMetadata[] = [];
  isLoading: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 12;

  readonly #contentService = inject(ContentService);

  ngOnInit(): void {
    this.loadContentList();
  }

  private loadContentList(): void {
    this.isLoading = true;

    const params = new HttpParams()
      .set('currentPage', this.currentPage)
      .set('itemsPerPage', this.itemsPerPage);

    this.#contentService
      .getMovies(params)
      .pipe(
        tap(({ result }: AllMoviesMetadataResponse) => {
          this.contentMetadataList = result.contents;
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }
}
