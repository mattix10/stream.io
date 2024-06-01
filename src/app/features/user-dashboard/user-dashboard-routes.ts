import { adminGuard } from 'src/app/core/guards/admin-guard';
import { UserDashboardComponent } from './user-dashboard.component';

export default [
  {
    path: '',
    component: UserDashboardComponent,
    children: [
      {
        path: 'edit',
        component: UserDashboardComponent,
        canMatch: [adminGuard],
      },
    ],
  },
];
