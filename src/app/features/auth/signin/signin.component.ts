import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { LoginRequest } from '../models/login-request';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './../shared/shared-form.component.scss',
})
export class SigninComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.minLength(6)),
  });

  #router = inject(Router);
  #authService = inject(AuthService);
  #toastrService = inject(ToastrService);

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const formvalue = this.form.value as LoginRequest;

    this.#authService
      .login(formvalue)
      .pipe(tap(() => this.#router.navigateByUrl('/')))
      .subscribe(() => this.#toastrService.success('success'));

    this.form.setValue({ email: '', password: '' });
  }

  protected navigate(): void {
    this.#router.navigateByUrl(`/auth/signup`);
  }
}
