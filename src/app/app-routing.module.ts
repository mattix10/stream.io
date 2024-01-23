import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

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
    path: 'movie',
    loadComponent: () =>
      import('./features/movie/movie.component').then(
        (mod) => mod.MovieComponent
      ),
  },
  {
    path: 'authorisation',
    loadComponent: () =>
      import('./features/authorisation/authorisation.component').then(
        (mod) => mod.AuthorisationComponent
      ),
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HomeComponent],
  exports: [RouterModule],
})
export class AppRoutingModule {}
