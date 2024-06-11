import { Component, inject, OnInit } from '@angular/core';
import { UserTableComponent } from './user-table/user-table.component';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user-service/user-service.service';
import { AsyncPipe } from '@angular/common';
import { mergeMap, tap } from 'rxjs';

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
    this.getUserList().subscribe();
  }

  onDeleteUser(id: string): void {
    this.#userService
      .deleteUser(id)
      .pipe(mergeMap(() => this.getUserList()))
      .subscribe();
  }

  private getUserList() {
    return this.#userService
      .getUsers()
      .pipe(tap(({ result }) => (this.users = result.users)));
  }
}
