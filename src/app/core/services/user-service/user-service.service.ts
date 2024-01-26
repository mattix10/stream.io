import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../models/user';
import { user } from 'src/app/mocks/user';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #httpService = inject(HttpService);

  getUser(id: string, params?: HttpParams): Observable<User> {
    // return this.#httpService.getItem<User>('users', id);
    return of(user);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.#httpService.update<User>('users', id, user);
  }
}
