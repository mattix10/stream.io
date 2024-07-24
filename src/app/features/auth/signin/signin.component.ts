import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginRequest } from '../models/login-request';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { isLoading } from '../../../core/models/loading';
import { errorMessage } from '../constants/toastr-messages';

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
    password: new FormControl('', Validators.minLength(6)),
  });

  isLoading: boolean = false;

  #router = inject(Router);
  #authService = inject(AuthService);
  #toastrService = inject(ToastrService);

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.isLoading = true;
    const formvalue = this.form.value as LoginRequest;

    this.#authService
      .login(formvalue)
      .pipe(
        tap(() => this.#router.navigateByUrl('/')),
        catchError(() => {
          this.#toastrService.error(errorMessage);
          return EMPTY;
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(() => {
        this.#toastrService.clear();
        this.form.setValue({ email: '', password: '' });
      });
  }

  protected navigate(): void {
    this.#router.navigateByUrl(`/auth/signup`);
  }
}
