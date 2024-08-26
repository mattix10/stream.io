import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { contentCreatorGuard } from './core/guards/content-creator.guard';

export const routes: Routes = [
  {
    path: 'user-dashboard',
    title: 'Panel użytkownika',
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
    title: 'Filmy użytkownika',
    canMatch: [contentCreatorGuard],
    loadComponent: () =>
      import('./features/user-movies/user-movies.component').then(
        (mod) => mod.UserMoviesComponent
      ),
  },
  {
    path: 'user-management',
    title: 'Zarządzanie użytkownikami',
    canMatch: [adminGuard],
    loadComponent: () =>
      import('./features/user-management/user-management.component').then(
        (mod) => mod.UserManagementComponent
      ),
  },
  {
    path: 'movie/:contentId',
    title: 'Szczegóły filmu',
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
    title: 'Wyniki wyszukiwania',
    loadComponent: () =>
      import('./features/search-results/search-results.component').then(
        (mod) => mod.SearchResultsComponent
      ),
  },
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', component: HomeComponent },
];
