import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from './../../../../environment/environment';
import { map, Observable, ReplaySubject } from 'rxjs';
import { Response } from '../../models/response';
import { UserResponse } from '../../models/responses/user-response';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Role } from '../../models/roles.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();
  isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    map((user) => !!user?.userName)
  );
  authUrl = environment.API_URL + 'auth/';

  readonly #httpClient = inject(HttpClient);
  readonly #router = inject(Router);

  constructor() {
    const token = this.getToken();

    if (token) {
      if (this.isTokenExpired()) {
        this.removeToken();
        this.removeCurrentUser();
      }
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
    this.removeToken();
    this.removeCurrentUser();
    this.#router.navigateByUrl('/');
  }

  isAdmin = (): Observable<boolean> =>
    this.currentUser$.pipe(
      map((user: User | null) => user?.role === Role.Admin)
    );

  isContentCreator = (): Observable<boolean> =>
    this.currentUser$.pipe(
      map((user: User | null) => user?.role === Role.ContentCreator)
    );

  isEndUser = (): Observable<boolean> =>
    this.currentUser$.pipe(
      map((user: User | null) => user?.role === Role.EndUser)
    );

  setCurrentUser(token: string): void {
    console.log(token);
    const { sub: id, role, email, name } = this.getDecodedToken(token);
    console.log(id);
    console.log(role);
    console.log(email);
    console.log(name);
    const user = new User(id, role, email, name);
    this.currentUserSource.next(user);
    this.setToken(token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isTokenExpired() {
    const token = this.getToken();

    if (!token) return true;

    return this.tokenExpired(token) ? true : false;
  }

  private removeCurrentUser(): void {
    this.currentUserSource.next(null);
  }

  private removeToken() {
    localStorage.removeItem('token');
  }

  private getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  private setToken(token: string) {
    console.log(token);
    localStorage.setItem('token', token);
  }

  private tokenExpired(token: string) {
    const expiry = this.getDecodedToken(token).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }
}
