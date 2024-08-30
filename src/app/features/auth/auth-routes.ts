import { RegistrationContentCreatorComponent } from './components/registration-content-creator/registration-content-creator.component';
import { RegistrationEndUserComponent } from './components/registration-end-user/registration-end-user.component';
import { SigninComponent } from './components/signin/signin.component';

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
