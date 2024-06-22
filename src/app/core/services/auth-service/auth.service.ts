import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from './../../../../environment/environment';
import { map, Observable, ReplaySubject } from 'rxjs';
import { Response } from '../../models/response';
import { UserResponse } from '../../models/user-response';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Role } from '../../models/roles.enum';
import { RegistrationContentCreatorRequest } from 'src/app/features/auth/models/registration-content-creator-request';
import { BaseRegistrationRequest } from 'src/app/features/auth/models/base-registration-request';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.#currentUserSource.asObservable();
  isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => !!user?.userName)
  );
  authUrl = environment.API_URL + 'auth/';

  readonly #httpClient = inject(HttpClient);
  readonly #router = inject(Router);

  constructor() {
    const token = this.getToken();
    if (token) {
      this.setCurrentUser(token);
    } else {
      this.removeCurrentUser();
    }
  }

  login(form: { password: string; email: string }): Observable<void> {
    return this.#httpClient
      .post<Response<UserResponse>>(`${this.authUrl}login`, form)
      .pipe(
        map(({ result: { token } }) => {
          this.setCurrentUser(token);
          this.#router.navigateByUrl('/');
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.#currentUserSource.next(null);
  }

  registerEndUser(formValue: BaseRegistrationRequest): Observable<boolean> {
    return this.#httpClient.post<boolean>(`${this.authUrl}end-user`, formValue);
  }

  registerContentCreator(
    registrationForm: RegistrationContentCreatorRequest
  ): Observable<void> {
    return this.#httpClient.post<void>(
      `${this.authUrl}content-creator`,
      registrationForm
    );
  }

  isAdmin = (): Observable<boolean> =>
    this.currentUser$.pipe(
      map((user: User | null) => {
        return user?.role === Role.ADMIN;
      })
    );

  isContentCreator = (): Observable<boolean> =>
    this.currentUser$.pipe(
      map((user: User | null) => user?.role === Role.CONTENT_CREATOR)
    );

  private setCurrentUser(token: string): void {
    console.log(token);
    const { sub: id, role, email, name } = this.getDecodedToken(token);
    const user = new User(id, role, email, name);
    this.#currentUserSource.next(user);
    console.log(user);
    this.setToken(token);
  }

  private removeCurrentUser(): void {
    this.#currentUserSource.next(null);
  }

  private getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  private getToken = () => localStorage.getItem('token');

  private setToken(token: string) {
    localStorage.setItem('token', token);
  }
}
