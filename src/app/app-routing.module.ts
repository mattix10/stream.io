import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin-guard';

const routes: Routes = [
  {
    path: 'user-dashboard',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./features/user-dashboard/user-dashboard.component').then(
        (mod) => mod.UserDashboardComponent
      ),
    loadChildren: () =>
      import('./features/user-dashboard/user-dashboard-routes'),
  },
  {
    path: 'user-movies',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./features/user-movies/user-movies.component').then(
        (mod) => mod.UserMoviesComponent
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
    path: 'movie/:uuid',
    loadComponent: () =>
      import('./features/movie/movie.component').then(
        (mod) => mod.MovieComponent
      ),
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
