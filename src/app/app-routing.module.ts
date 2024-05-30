import { NgModule, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterModule,
  Routes,
} from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { MoviesService } from './core/services/movies-service/movies.service';
import { Movie } from './core/models/movie';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin-guard';

export const movieResolver: ResolveFn<Movie> = (
  route: ActivatedRouteSnapshot
) => inject(MoviesService).getMovie(route.paramMap.get('id')!);

const routes: Routes = [
  {
    path: 'user-dashboard',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./features/user-dashboard/user-dashboard.component').then(
        (mod) => mod.UserDashboardComponent
      ),
  },
  {
    path: 'user-management',
    canMatch: [adminGuard],
    loadComponent: () =>
      import('./features/user-management/user-management.component').then(
        (mod) => mod.UserManagementComponent
      ),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./features/movie/movie.component').then(
        (mod) => mod.MovieComponent
      ),
    resolve: { movie: movieResolver },
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/auth.component').then((mod) => mod.AuthComponent),
    loadChildren: () => import('./features/auth/auth-routes'),
  },
  {
    path: 'search-results',
    loadComponent: () =>
      import('./features/search-results/search-results.component').then(
        (mod) => mod.SearchResultsComponent
      ),
  },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HomeComponent],
  exports: [RouterModule],
})
export class AppRoutingModule {}
