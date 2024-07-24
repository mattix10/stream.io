import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BaseRegistrationRequest } from '../models/base-registration-request';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { registrationSuccess } from '../constants/toastr-messages';
import { isLoading } from '../../../core/models/loading';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-registration-end-user',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './registration-end-user.component.html',
  styleUrl: './../shared/shared-form.component.scss',
})
export class RegistrationEndUserComponent implements isLoading {
  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    username: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
  });
  isLoading: boolean = false;

  readonly #router = inject(Router);
  readonly #userService = inject(UserService);
  readonly #toastrService = inject(ToastrService);

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;

    this.#userService
      .registerEndUser(this.form.value as unknown as BaseRegistrationRequest)
      .pipe(
        tap(() => this.navigateToSignIn()),
        catchError((error) => {
          this.#toastrService.error(
            `${error.error?.message} Rejestracja nie powiodła się.`
          );
          return EMPTY;
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(() => this.#toastrService.success(registrationSuccess));
  }

  navigateToSignIn(): void {
    this.#router.navigateByUrl(`/auth/signin`);
  }

  navigateToContentCreatorRegistration(): void {
    this.#router.navigateByUrl(`/auth/signup-content-creator`);
  }
}
