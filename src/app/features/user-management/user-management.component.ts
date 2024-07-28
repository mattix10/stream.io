import { Component, inject, OnInit } from '@angular/core';
import { UserTableComponent } from './user-table/user-table.component';
import { User } from 'src/app/core/models/user';
import { AsyncPipe } from '@angular/common';
import { finalize, mergeMap, Observable, tap } from 'rxjs';
import { UserStatusEvent } from '../user-dashboard/models/user-status-event';
import { UserService } from 'src/app/core/services/user.service';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { isLoading } from 'src/app/core/models/loading';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [AsyncPipe, UserTableComponent, SpinnerComponent],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit, isLoading {
  users: User[] = [];
  isLoading: boolean = false;
  readonly #userService = inject(UserService);

  ngOnInit(): void {
    this.isLoading = true;
    this.getUserList().subscribe();
  }

  onUserStatusChanged({ status, userName }: UserStatusEvent): void {
    this.#userService
      .updateUserStatus(userName, { status })
      .pipe(mergeMap(() => this.getUserList()))
      .subscribe();
  }

  private getUserList(): Observable<any> {
    return this.#userService.getUsers().pipe(
      tap(({ result }) => (this.users = result.users)),
      finalize(() => (this.isLoading = false))
    );
  }
}
