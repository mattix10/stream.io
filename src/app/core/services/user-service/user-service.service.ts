import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../models/user';
import { user } from 'src/app/mocks/user';
import { HttpService } from '../http-service/http.service';
import { environment } from 'src/environment/environment';
import { Response } from '../../models/response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #httpService = inject(HttpService);
  #httpClient = inject(HttpClient);

  getUser(id: string, params?: HttpParams): Observable<User> {
    // return this.#httpService.getItem<User>('users', id);
    return of(user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.#httpService.update<User>('users', id, user);
  }

  getUsers(): Observable<any> {
    return this.#httpService.getItems('users');
  }
}
