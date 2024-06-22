import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../models/user';
import { HttpService } from '../http-service/http.service';
import { UserData } from '../../../features/user-dashboard/models/user-data';
import { BaseUpdateUserRequest } from '../../models/base-update-user-request';
import { UpdateContentCreatorRequest } from '../../models/update-content-creator-request';
import { Response } from '../../models/response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #httpService = inject(HttpService);

  getUser(): Observable<Response<User>> {
    return this.#httpService.getItem<Response<User>>('users/user');
  }

  updateEndUser(
    user: BaseUpdateUserRequest
  ): Observable<BaseUpdateUserRequest> {
    return this.#httpService.update<UserData>('users/end-user', user);
  }

  updateContentCreator(
    user: UpdateContentCreatorRequest
  ): Observable<UpdateContentCreatorRequest> {
    return this.#httpService.update<UserData>('users/content-creator', user);
  }

  getUsers(): Observable<any> {
    return this.#httpService.getItems('users');
  }

  deleteUser(id: string): Observable<any> {
    return this.#httpService.delete('users', id);
  }
}
