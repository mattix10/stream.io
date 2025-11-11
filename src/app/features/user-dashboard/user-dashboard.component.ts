import { Component, OnInit, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from '@app/core/models/classes/user';
import { UserDataComponent } from './components/user-data/user-data.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserService } from '@app/core/services/user.service';
import { isLoading } from '@app/core/models/interfaces/loading';
import { SpinnerComponent } from '@app/shared/components/spinner/spinner.component';
import { UserResponse } from '@app/core/models/responses/user-response';

@Component({
  selector: 'app-user-dashboard',
  imports: [
    CommonModule,
    UserDataComponent,
    DeleteAccountComponent,
    ChangePasswordComponent,
    SpinnerComponent,
  ],
  templateUrl: './user-dashboard.component.html',
})
export class UserDashboardComponent implements isLoading, OnInit {
  user: User | null = null;
  isLoading = true;

  readonly #userService = inject(UserService);

  ngOnInit(): void {
    this.loadUserData();
  }

  onUserDataChanged(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.loadUser().subscribe();
  }

  private loadUser(): Observable<UserResponse> {
    this.isLoading = true;

    return this.#userService.getUser().pipe(
      tap(({ result: user }) => {
        this.isLoading = false;
        this.user = user;
      })
    );
  }
}
