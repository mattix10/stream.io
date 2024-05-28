import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, tap } from 'rxjs';
import { LoginRequest } from 'src/app/core/models/login-request';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  protected actionTitle: string = 'Zaloguj';
  protected isSignInMode: boolean = true;
  protected info: string = '';
  protected redirectLink: string = '';
  form = new FormGroup({
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.minLength(6)),
  });

  #router = inject(Router);
  #authService = inject(AuthService);
  #toastrService = inject(ToastrService);

  ngOnInit(): void {
    this.setMode();
    this.setRouterEventsListener();
  }

  onSubmit(): void {
    console.log(this.form);
    if (this.form.invalid) {
      return;
    }

    const formvalue = this.form.value as LoginRequest;

    if (this.isSignInMode) {
      this.#authService
        .login(formvalue)
        .pipe(tap(() => this.#router.navigateByUrl('/')))
        .subscribe(() => {
          this.#toastrService.success('success');
        });
    } else {
      this.#authService
        .registration(formvalue)
        .pipe(tap(() => this.#router.navigateByUrl('/auth/signin')))
        .subscribe();
    }

    this.form.setValue({ email: '', password: '' });
  }

  protected navigate(): void {
    this.#router.navigateByUrl(`/auth/${this.redirectLink}`);
  }

  private setRouterEventsListener(): void {
    this.#router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.setMode());
  }

  private setMode(): void {
    let url = this.#router.url;
    this.isSignInMode = url.includes('signin') ? true : false;
    this.setText();
  }

  private setText() {
    if (this.isSignInMode) {
      this.actionTitle = 'Zaloguj';
      this.info = 'Nie masz konta? Zarejestruj się';
      this.redirectLink = 'signup';
    } else {
      this.actionTitle = 'Zarejestruj';
      this.info = 'Masz konto? Zaloguj się';
      this.redirectLink = 'signin';
    }
  }
}
