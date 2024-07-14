import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRegistrationRequest } from 'src/app/features/auth/models/base-registration-request';
import { RegistrationContentCreatorRequest } from 'src/app/features/auth/models/registration-content-creator-request';
import { UserData } from 'src/app/features/user-dashboard/models/user-data';
import { BaseUpdateUserRequest } from '../models/requests/base-update-user-request';
import { ChangePasswordRequest } from '../models/requests/change-password-request';
import { UpdateContentCreatorRequest } from '../models/requests/update-content-creator-request';
import { UpdateUserStatusRequest } from '../models/requests/update-user-status-request';
import { User } from '../models/user';
import { HttpService } from './http.service';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly #httpService = inject(HttpService);
  readonly #entity = 'users';

  registerEndUser(formValue: BaseRegistrationRequest): Observable<void> {
    return this.#httpService.create<void, BaseRegistrationRequest>(
      `${this.#entity}/end-user`,
      formValue
    );
  }

  registerContentCreator(
    registrationForm: RegistrationContentCreatorRequest
  ): Observable<void> {
    return this.#httpService.create<void, RegistrationContentCreatorRequest>(
      `${this.#entity}/content-creator`,
      registrationForm
    );
  }

  getUser(): Observable<Response<User>> {
    return this.#httpService.getItem<Response<User>>(`${this.#entity}/user`);
  }

  getUsers(): Observable<any> {
    return this.#httpService.getItems(this.#entity);
  }

  updateEndUser(user: BaseUpdateUserRequest): Observable<void> {
    return this.#httpService.update<void, UserData>(
      `${this.#entity}/end-user`,
      user
    );
  }

  updateContentCreator(user: UpdateContentCreatorRequest): Observable<void> {
    return this.#httpService.update<void, UserData>(
      `${this.#entity}/content-creator`,
      user
    );
  }

  updateUserStatus(
    username: string,
    userStatus: UpdateUserStatusRequest
  ): Observable<void> {
    return this.#httpService.updateStatus(
      `${this.#entity}/${username}/status`,
      userStatus
    );
  }

  changePassword(
    changePasswordRequest: ChangePasswordRequest
  ): Observable<ChangePasswordRequest> {
    return this.#httpService.updateEntity<ChangePasswordRequest>(
      `${this.#entity}/password`,
      changePasswordRequest
    );
  }

  deleteUser(password: string): Observable<void> {
    return this.#httpService.delete(this.#entity, undefined, { password });
  }
}
