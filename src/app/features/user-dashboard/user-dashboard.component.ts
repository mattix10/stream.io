import { Component, OnInit, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/core/models/user';
import { UserDataComponent } from './components/user-data/user-data.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UserDataComponent,
    DeleteAccountComponent,
    ChangePasswordComponent,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit {
  user: User | null = null;
  isEditMode: boolean = false;
  isContentCreator: boolean = false;

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

  private loadUser(): Observable<any> {
    return this.#userService.getUser().pipe(
      tap(({ result: user }) => {
        this.user = user;
      })
    );
  }
}
