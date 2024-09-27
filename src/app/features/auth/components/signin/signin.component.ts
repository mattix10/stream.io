import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { isLoading } from 'src/app/core/models/interfaces/loading';
import { LoginRequest } from 'src/app/core/models/requests/login-request';
import { AuthService } from 'src/app/core/services/auth.service';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './signin.component.html',
  styleUrl: './../shared/shared-form.component.scss',
})
export class SigninComponent implements isLoading {
  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  isLoading: boolean = false;

  #router = inject(Router);
  #authService = inject(AuthService);

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
    const formvalue = this.form.value as LoginRequest;

    this.#authService
      .login(formvalue)
      .pipe(
        tap(() => {
          this.#router.navigateByUrl('/');
          this.form.setValue({ email: '', password: '' });
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  protected navigateToEndUserRegistration(): void {
    this.#router.navigateByUrl(`/auth/signup`);
  }
}
