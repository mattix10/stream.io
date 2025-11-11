import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { isLoading } from '@app/core/models/interfaces/loading';
import { ChangePasswordRequest } from '@app/core/models/requests/change-password-request';
import { AuthService } from '@app/core/services/auth.service';
import { UserService } from '@app/core/services/user.service';
import { EditHeaderComponent } from '@app/features/user-dashboard/components/edit-header/edit-header.component';
import { SpinnerComponent } from '@app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-change-password',
  imports: [SpinnerComponent, ReactiveFormsModule, EditHeaderComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements isLoading {
  isEditMode = false;
  isLoading = false;

  readonly #formBuilder = inject(FormBuilder);
  readonly #userService = inject(UserService);
  readonly #authService = inject(AuthService);
  readonly #router = inject(Router);

  #validators = [Validators.required, Validators.minLength(6)];

  changePasswordForm = this.#formBuilder.group({
    oldPassword: this.#formBuilder.control('', this.#validators),
    newPassword: this.#formBuilder.control('', this.#validators),
  });

  get newPassword() {
    return this.changePasswordForm.get('newPassword');
  }

  onEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  onChangePassword(): void {
    if (this.changePasswordForm.invalid) return;

    this.isLoading = true;
    this.#userService
      .changePassword(this.changePasswordForm.value as ChangePasswordRequest)
      .pipe(
        tap(() => {
          this.#authService.logout();
          this.#router.navigateByUrl('/auth/signin');
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }
}
