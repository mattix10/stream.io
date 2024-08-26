import { RegistrationContentCreatorComponent } from './registration-content-creator/registration-content-creator.component';
import { RegistrationEndUserComponent } from './registration-end-user/registration-end-user.component';
import { SigninComponent } from './signin/signin.component';

export default [
  {
    path: '',
    children: [
      {
        path: 'signup',
        component: RegistrationEndUserComponent,
        title: 'Rejestracja użytkownika',
      },
      {
        path: 'signup-content-creator',
        component: RegistrationContentCreatorComponent,
        title: 'Rejestracja dla firm',
      },
      { path: 'signin', component: SigninComponent, title: 'Logowanie' },
    ],
  },
  {
    path: '**',
    redirectTo: 'signin',
  },
];
