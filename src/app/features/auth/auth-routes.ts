import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';

export default [
  {
    path: '',
    component: AuthComponent,
    children: [
      { path: 'signin', component: AuthComponent },
      { path: 'signup', component: AuthComponent },
    ],
  },
  {
    path: '**',
    redirectTo: 'signin',
  },
];
