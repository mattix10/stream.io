import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from './../../../../environment/environment';
import { map, Observable, ReplaySubject, take, tap } from 'rxjs';
import { Response } from '../../models/response';
import { UserResponse } from '../../models/user-response';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Role } from '../../models/roles.enum';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.#currentUserSource.asObservable();
  isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => !!user?.email)
  );

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
      .post<Response<UserResponse>>(`${environment.AUTH_URL}login`, form)
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

  registration(form: { password: string; email: string }): Observable<boolean> {
    return this.#httpClient.post<boolean>(
      `${environment.AUTH_URL}register`,
      form
    );
  }

  isAdmin = (): Observable<boolean> =>
    this.currentUser$.pipe(
      map((user: User | null) => {
        console.log(!!user?.roles.includes(Role.ADMIN));
        return !!user?.roles.includes(Role.ADMIN);
      })
    );

  isContentCreator = (): Observable<boolean> =>
    this.currentUser$.pipe(
      map((user: User | null) => !!user?.roles.includes(Role.CONTENT_CREATOR))
    );

  private setCurrentUser(token: string): void {
    console.log(token);
    const { role, email, userName } = this.getDecodedToken(token);
    const user = new User('', [role], email, userName);
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
