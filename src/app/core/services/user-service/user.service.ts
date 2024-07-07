import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { HttpService } from '../http-service/http.service';
import { UserData } from '../../../features/user-dashboard/models/user-data';
import { BaseUpdateUserRequest } from '../../models/requests/base-update-user-request';
import { UpdateContentCreatorRequest } from '../../models/requests/update-content-creator-request';
import { Response } from '../../models/response';
import { BaseRegistrationRequest } from 'src/app/features/auth/models/base-registration-request';
import { RegistrationContentCreatorRequest } from 'src/app/features/auth/models/registration-content-creator-request';
import { UpdateUserStatusRequest } from '../../models/requests/update-user-status-request';
import { ChangePasswordRequest } from '../../models/requests/change-password-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly #httpService = inject(HttpService);

  registerEndUser(
    formValue: BaseRegistrationRequest
  ): Observable<BaseRegistrationRequest> {
    return this.#httpService.create<BaseRegistrationRequest>(
      `users/end-user`,
      formValue
    );
  }

  registerContentCreator(
    registrationForm: RegistrationContentCreatorRequest
  ): Observable<RegistrationContentCreatorRequest> {
    return this.#httpService.create<RegistrationContentCreatorRequest>(
      `users/content-creator`,
      registrationForm
    );
  }

  getUser(): Observable<Response<User>> {
    return this.#httpService.getItem<Response<User>>('users/user');
  }

  getUsers(): Observable<any> {
    return this.#httpService.getItems('users');
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

  updateUserStatus(
    username: string,
    userStatus: UpdateUserStatusRequest
  ): Observable<void> {
    return this.#httpService.updateStatus(
      `users/${username}/status`,
      userStatus
    );
  }

  changePassword(
    changePasswordRequest: ChangePasswordRequest
  ): Observable<ChangePasswordRequest> {
    return this.#httpService.updateEntity<ChangePasswordRequest>(
      'users/password',
      changePasswordRequest
    );
  }

  deleteUser(password: string): Observable<any> {
    return this.#httpService.delete('users', undefined, password);
  }
}
