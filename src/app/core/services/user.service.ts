import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
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
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly #httpService = inject(HttpService);
  readonly #entity = 'user';

  readonly #loggerService = inject(LoggerService);

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
    return this.#httpService.getItem<Response<User>>(`${this.#entity}`);
  }

  getUsers(): Observable<any> {
    return this.#httpService
      .getItems(`${this.#entity}/all`)
      .pipe(this.#loggerService.error('Nie udało się załadować użytkowników'));
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
    return this.#httpService
      .updateStatus(`${this.#entity}/${username}/status`, userStatus)
      .pipe(
        this.#loggerService.error(
          `Aktualizacja statusu użytkownika "${username}" nie powiodła się.`
        ),
        tap(() => {
          this.#loggerService.success(
            `Status użytkownika "${username}" został zaktualizowany.`
          );
        })
      );
  }

  changePassword(
    changePasswordRequest: ChangePasswordRequest
  ): Observable<ChangePasswordRequest> {
    return this.#httpService.updateField<ChangePasswordRequest>(
      `${this.#entity}/password`,
      changePasswordRequest
    );
  }

  deleteUser(password: string): Observable<void> {
    return this.#httpService.delete(this.#entity, undefined, { password });
  }
}
