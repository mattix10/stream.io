import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { UserService } from 'src/app/core/services/user-service/user-service.service';
import { isLoading } from 'src/app/features/auth/models/loading';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [SpinnerComponent, FormsModule],
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
  password: string = '';

  onEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  onDelete(): void {
    this.#userService
      .deleteUser(this.password)
      .pipe(
        catchError(() => {
          this.#toastrService.error('Nie udało się usunąć użytkownika.');
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.#authService.logout();
        this.#router.navigateByUrl('/');
        this.#toastrService.success('Konto zostało usunięte.');
      });
  }
}
