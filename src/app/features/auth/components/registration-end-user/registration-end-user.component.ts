import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { SpinnerComponent } from '@app/shared/components/spinner/spinner.component';
import { UserService } from '@app/core/services/user.service';
import { isLoading } from '@app/core/models/interfaces/loading';
import { BaseRegistrationRequest } from '@app/core/models/requests/base-registration-request';

@Component({
  selector: 'app-registration-end-user',
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

  get username() {
    return this.form.get('username');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.isLoading = true;

    this.#userService
      .registerEndUser(this.form.value as unknown as BaseRegistrationRequest)
      .pipe(
        tap(() => this.navigateToSignIn()),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  navigateToSignIn(): void {
    this.#router.navigateByUrl(`/auth/signin`);
  }

  navigateToContentCreatorRegistration(): void {
    this.#router.navigateByUrl(`/auth/signup-content-creator`);
  }
}
