import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { isLoading } from 'src/app/core/models/loading';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { EditHeaderComponent } from 'src/app/shared/components/edit-header/edit-header.component';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [SpinnerComponent, ReactiveFormsModule, EditHeaderComponent],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss',
})
export class DeleteAccountComponent implements isLoading {
  isEditMode = false;
  isLoading: boolean = false;

  #userService = inject(UserService);
  #toastrService = inject(ToastrService);
  #authService = inject(AuthService);
  #router = inject(Router);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  onEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  onDelete(): void {
    this.isLoading = true;
    this.#userService
      .deleteUser(this.password.value as string)
      .pipe(
        tap(() => {
          this.#authService.logout();
          this.#router.navigateByUrl('/');
          this.#toastrService.success('Konto zostało usunięte.');
        }),
        catchError(() => {
          this.#toastrService.error('Nie udało się usunąć użytkownika.');
          return EMPTY;
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }
}
