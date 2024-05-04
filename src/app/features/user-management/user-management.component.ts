import { Component } from '@angular/core';
import { UserTableComponent } from './user-table/user-table.component';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [UserTableComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  users: User[] = [];
}
