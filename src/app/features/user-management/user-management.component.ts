import { Component, inject, OnInit } from '@angular/core';
import { UserTableComponent } from './user-table/user-table.component';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user-service/user-service.service';
import { Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [AsyncPipe, UserTableComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];

  readonly #userService = inject(UserService);

  ngOnInit(): void {
    console.log('here2');
    this.#userService.getUsers().subscribe(({ result }) => {
      console.log(result);
      this.users = result.users;
    });
  }
}
