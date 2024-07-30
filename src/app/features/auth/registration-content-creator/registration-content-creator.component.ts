import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationContentCreatorRequest } from '../models/registration-content-creator-request';
import { finalize, tap } from 'rxjs';
import { SpinnerComponent } from 'src/app/shared/components/spinner/spinner.component';
import { isLoading } from '../../../core/models/loading';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-registration-content-creator',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './registration-content-creator.component.html',
  styleUrl: './../shared/shared-form.component.scss',
})
export class RegistrationContentCreatorComponent implements isLoading {
  readonly #fb = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #userService = inject(UserService);
  isLoading: boolean = false;

  form = this.#fb.group({
    email: new FormControl('', [Validators.email, Validators.required]),
    username: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    phoneNumber: new FormControl('', [
      Validators.minLength(9),
      Validators.required,
    ]),
    nip: new FormControl('', [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$'),
      Validators.required,
    ]),
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading = true;
    const formValue = this.form.value;

    this.#userService
      .registerContentCreator(
        formValue as unknown as RegistrationContentCreatorRequest
      )
      .pipe(
        tap(() => this.navigateToSignIn()),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  navigateToSignIn(): void {
    this.#router.navigateByUrl(`/auth/signin`);
  }
}
