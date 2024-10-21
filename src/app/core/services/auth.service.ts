import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, Observable, map } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Role } from '../models/enums/roles.enum';
import { User } from '../models/classes/user';
import { LoggerService } from './logger.service';
import { LoginRequest } from '../models/requests/login-request';
import { UserAuthDataResponse } from '../models/responses/user-auth-data-response';
import { Token } from '../models/interfaces/token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.#currentUserSource.asObservable();
  isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => !!user?.userName)
  );

  readonly #httpClient = inject(HttpClient);
  readonly #router = inject(Router);
  readonly #loggerService = inject(LoggerService);
  readonly #authUrl = environment.API_URL + 'user/';

  constructor() {
    this.handleUser();
  }

  login(form: LoginRequest): Observable<void> {
    return this.#httpClient
      .post<UserAuthDataResponse>(`${this.#authUrl}sign-in`, form)
      .pipe(
        map(({ result: { token } }) => {
          this.setCurrentUser(token);
          this.#router.navigateByUrl('/');
        }),
        this.#loggerService.error<void>(
          'Wystąpił błąd. Spróbuj ponownie później.'
        )
      );
  }

  logout(): void {
    this.removeToken();
    this.removeCurrentUser();
    this.#router.navigateByUrl('/');
  }

  isAdmin = (): Observable<boolean> =>
    this.currentUser$.pipe(
      map((user: User | null) => user?.userLevel === Role.Admin)
    );

  isContentCreator = (): Observable<boolean> =>
    this.currentUser$.pipe(
      map((user: User | null) => user?.userLevel === Role.ContentCreator)
    );

  isEndUser = (): Observable<boolean> =>
    this.currentUser$.pipe(
      map((user: User | null) => user?.userLevel === Role.EndUser)
    );

  setCurrentUser(token: string): void {
    const { sub: id, role, email, name } = this.getDecodedToken(token);
    const user = new User(id, role, email, name);
    this.#currentUserSource.next(user);
    this.setToken(token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();

    if (!token) return true;

    const expiry = this.getDecodedToken(token).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }

  removeCurrentUser(): void {
    this.#currentUserSource.next(null);
  }

  private handleUser(): void {
    const token = this.getToken();

    if (token) {
      if (this.isTokenExpired()) {
        this.removeToken();
        this.removeCurrentUser();
      }

      this.setCurrentUser(token);
      return;
    }

    this.removeCurrentUser();
  }

  private removeToken(): void {
    sessionStorage.removeItem('token');
  }

  private getDecodedToken(token: string): Token {
    return JSON.parse(atob(token.split('.')[1]));
  }

  private setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }
}
