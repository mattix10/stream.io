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

export const movieResolver: ResolveFn<Movie> = (
  route: ActivatedRouteSnapshot
) => {
  return inject(MoviesService).getMovie(route.paramMap.get('id')!);
};

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'user-dashboard',
    loadComponent: () =>
      import('./features/user-dashboard/user-dashboard.component').then(
        (mod) => mod.UserDashboardComponent
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
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HomeComponent],
  exports: [RouterModule],
})
export class AppRoutingModule {}
