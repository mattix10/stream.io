import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'app-search-movie-input',
    imports: [FormsModule],
    templateUrl: './search-movie-input.component.html',
    styleUrl: './search-movie-input.component.scss'
})
export class SearchMovieInputComponent {
  readonly #router = inject(Router);
  readonly #activatedRoute = inject(ActivatedRoute);
  protected searchValue: string = '';

  ngOnInit(): void {
    this.getSearchValue();
  }

  protected navigateToSearchResults(): void {
    this.#router.navigate(['search-results'], {
      queryParams: {
        search: this.searchValue ?? null,
      },
      queryParamsHandling: 'merge',
    });
  }

  protected resetSearchValue(): void {
    this.searchValue = '';
  }

  private getSearchValue(): void {
    this.#activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchValue = params['search'];
    });
  }
}
