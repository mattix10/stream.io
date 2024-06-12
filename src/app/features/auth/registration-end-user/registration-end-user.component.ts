import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { BaseRegistrationRequest } from '../models/base-registration-request';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  errorMessage,
  registrationSuccess,
} from '../constants/toastr-messages';
import { isLoading } from '../models/loading';

@Component({
  selector: 'app-registration-end-user',
  standalone: true,
  imports: [ReactiveFormsModule],
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
  readonly #authService = inject(AuthService);
  readonly #toastrService = inject(ToastrService);

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;

    this.#authService
      .registerEndUser(this.form.value as unknown as BaseRegistrationRequest)
      .pipe(
        tap(() => this.navigateToSignIn()),
        catchError(() => {
          this.#toastrService.error(errorMessage);
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
