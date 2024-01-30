import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

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

  ngOnInit(): void {
    this.setMode();
    this.setRouterEventsListener();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    const formvalue = this.form.value;

    if (this.isSignInMode) {
      // this.#authService.login(formvalue);
    }

    // this.#authService.registration(formvalue);
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
