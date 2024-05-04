import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  protected isMobileMenuVisible = false;
  protected searchValue: string = '';
  #router = inject(Router);
  #activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.#activatedRoute.queryParams.subscribe((params: Params) => {
      this.searchValue = params['search'];
    });
  }

  protected toggleMobileVisibility(): void {
    this.isMobileMenuVisible = !this.isMobileMenuVisible;
  }

  protected reset(): void {
    this.searchValue = '';
  }

  protected search(): void {
    this.#router.navigate(['search-results'], {
      queryParams: {
        search: this.searchValue ? this.searchValue : null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
