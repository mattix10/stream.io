import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../models/user';
import { user } from 'src/app/mocks/user';
import { HttpService } from '../http-service/http.service';
import { UserData } from '../../../features/user-dashboard/models/user-data';
import { UserResponse } from '../../models/user-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #httpService = inject(HttpService);

  getUser(id: string, params?: HttpParams): Observable<any> {
    return this.#httpService.getItem<UserResponse>('users', id);
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.#httpService.update<User>('users', id, user);
  }

  updateMe(id: string, user: UserData): Observable<UserData> {
    return this.#httpService.update<UserData>('users', id, user);
  }

  getUsers(): Observable<any> {
    return this.#httpService.getItems('users');
  }

  deleteUser(id: string): Observable<any> {
    return this.#httpService.delete('users', id);
  }
}
