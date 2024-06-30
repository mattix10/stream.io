import { Component, inject, OnInit } from '@angular/core';
import { UserTableComponent } from './user-table/user-table.component';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user-service/user-service.service';
import { AsyncPipe } from '@angular/common';
import { catchError, EMPTY, mergeMap, Observable, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserStatusEvent } from '../user-dashboard/models/user-status-event';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [AsyncPipe, UserTableComponent],
  templateUrl: './user-management.component.html',
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];

  readonly #toastrService = inject(ToastrService);
  readonly #userService = inject(UserService);

  ngOnInit(): void {
    this.getUserList().subscribe();
  }

  onUserStatusChanged({ isActive, userName }: UserStatusEvent): void {
    this.#userService
      .updateUserStatus(userName, { isActive })
      .pipe(
        catchError(() => {
          this.#toastrService.error(
            `Aktualizacja statusu użytkownika "${userName}" nie powiodła się.`
          );
          return EMPTY;
        }),
        mergeMap(() => {
          this.#toastrService.success(
            `Status użytkownika "${userName}" został zaktualizowany.`
          );
          return this.getUserList();
        })
      )
      .subscribe();
  }

  private getUserList(): Observable<any> {
    return this.#userService
      .getUsers()
      .pipe(tap(({ result }) => (this.users = result.users)));
  }
}
