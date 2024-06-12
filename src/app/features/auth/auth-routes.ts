import { RegistrationContentCreatorComponent } from './registration-content-creator/registration-content-creator.component';
import { RegistrationEndUserComponent } from './registration-end-user/registration-end-user.component';
import { SigninComponent } from './signin/signin.component';

export default [
  {
    path: '',
    children: [
      { path: 'signup', component: RegistrationEndUserComponent },
      {
        path: 'signup-content-creator',
        component: RegistrationContentCreatorComponent,
      },
      { path: 'signin', component: SigninComponent },
    ],
  },
  {
    path: '**',
    redirectTo: 'signin',
  },
];
