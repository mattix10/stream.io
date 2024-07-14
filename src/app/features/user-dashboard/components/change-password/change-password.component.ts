import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, finalize } from 'rxjs';
import { ChangePasswordRequest } from 'src/app/core/models/requests/change-password-request';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { isLoading } from 'src/app/features/auth/models/loading';
import { EditHeaderComponent } from 'src/app/shared/components/edit-header/edit-header.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    SpinnerComponent,
    ReactiveFormsModule,
    EditHeaderComponent,
    EditHeaderComponent,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements isLoading {
  isEditMode = false;
  isLoading: boolean = false;

  #formBuilder = inject(FormBuilder);
  #userService = inject(UserService);
  #toastrService = inject(ToastrService);
  #authService = inject(AuthService);
  #router = inject(Router);

  #validators = [Validators.required, Validators.minLength(6)];

  changePasswordForm = this.#formBuilder.group({
    oldPassword: this.#formBuilder.control('', this.#validators),
    newPassword: this.#formBuilder.control('', this.#validators),
  });

  onEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  onChangePassword(): void {
    console.log(this.changePasswordForm);

    if (this.changePasswordForm.invalid) return;

    this.isLoading = true;
    this.#userService
      .changePassword(this.changePasswordForm.value as ChangePasswordRequest)
      .pipe(
        catchError(() => {
          this.#toastrService.error('Nie udało się zmienić hasła.');
          return EMPTY;
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(() => {
        this.#authService.logout();
        this.#router.navigateByUrl('/auth/signin');
        this.#toastrService.success(
          'Hasło zostało zmienione pomyślnie. Zaloguj się ponownie.'
        );
      });
  }
}
