import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MoviesService } from 'src/app/core/services/movies-service/movies.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  protected isMobileMenuVisible = false;
  protected searchValue: string = '';
  #router = inject(Router);

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
