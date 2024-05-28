import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from './../../../../environment/environment';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { Response } from '../../models/response';
import { UserResponse } from '../../models/user-response';
import { User } from '../../models/user';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.#currentUserSource.asObservable();
  isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(
    tap((data) => console.log(data)),
    map((user) => !!user?.email)
  );
  #httpClient = inject(HttpClient);
  #router = inject(Router);

  constructor() {
    const token = this.getToken();
    if (token) {
      this.setCurrentUser(token);
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

  registration(form: { password: string; email: string }): Observable<boolean> {
    return this.#httpClient.post<boolean>(
      `${environment.AUTH_URL}register`,
      form
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.#currentUserSource.next(null);
  }

  private setCurrentUser(token: string): void {
    console.log(token);
    const user = this.getDecodedToken(token);
    this.#currentUserSource.next(user);
    console.log(user);
    console.log(token);
    this.setToken(token);
  }

  private getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  private getToken = () => localStorage.getItem('token');

  private setToken(token: string) {
    localStorage.setItem('token', token);
  }
}
